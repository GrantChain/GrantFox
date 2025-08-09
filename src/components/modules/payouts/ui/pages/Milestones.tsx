"use client";

import type { Evidence, Feedback, Milestone } from "@/@types/milestones.entity";
import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { usePayouts } from "@/components/modules/payouts/hooks/usePayouts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Payout } from "@/generated/prisma";
import type { Prisma } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import { getPublicUrl } from "@/utils/images.utils";
import { isImage } from "@/utils/is-valid.utils";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import {
  Calendar,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Package,
  Paperclip,
  Plus,
  ShieldCheck,
  ShieldX,
  Strikethrough,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { usePayoutMutations } from "../../hooks/usePayoutMutations";
import { payoutsService } from "../../services/payouts.service";

const Milestones = () => {
  const params = useParams<{ id: string }>();
  const payoutId = params?.id as string;
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
  } = usePayouts({ role: user?.role, userId: user?.user_id });

  const payoutFromList = useMemo<Payout | undefined>(() => {
    return listData?.data.find((p) => p.payout_id === payoutId);
  }, [listData?.data, payoutId]);

  const {
    data: oneData,
    isLoading: isOneLoading,
    error: oneError,
  } = useQuery({
    queryKey: ["payout", payoutId],
    queryFn: () => payoutsService.findOne(payoutId),
    enabled: !payoutFromList && Boolean(payoutId),
    staleTime: 30 * 1000,
  });

  const payout: Payout | undefined = payoutFromList ?? oneData ?? undefined;

  const isLoading =
    isAuthLoading || isListLoading || isListFetching || isOneLoading;
  const error = listError || oneError;

  if (isLoading) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading milestones…</CardTitle>
            <CardDescription>Please wait</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!payout && error) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error loading payout</CardTitle>
            <CardDescription>Try again later</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/">Back</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!payout) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Payout not found</CardTitle>
            <CardDescription>Go back to the payouts list.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Back</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container pb-4 space-y-4">
      <PageHeader payout={payout} />
      <MilestonesList payout={payout} />
    </div>
  );
};

export default Milestones;

// Sub-components and logic
const PageHeader = ({ payout }: { payout: Payout }) => {
  const { user } = useAuth();
  const rolePath = user?.role === "GRANTEE" ? "grantee" : "payout-provider";
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold truncate">{payout.title}</h1>
        <p className="text-xs text-muted-foreground">
          Milestones management, evidence & feedback
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/${rolePath}/payouts`}>Back</Link>
        </Button>
      </div>
    </div>
  );
};

const MilestonesList = ({ payout }: { payout: Payout }) => {
  const { user } = useAuth();
  const canSubmitEvidence = user?.role === "GRANTEE";
  const canModerate =
    user?.role === "PAYOUT_PROVIDER" || user?.role === "ADMIN";
  const { updatePayoutMilestones, isUpdatingMilestones, uploadFiles } =
    usePayoutMutations();

  const [localMilestones, setLocalMilestones] = useState<Milestone[]>(
    (payout.milestones as unknown as Milestone[]) || [],
  );

  useEffect(() => {
    setLocalMilestones((payout.milestones as unknown as Milestone[]) || []);
  }, [payout.milestones]);

  const [evidenceUrl, setEvidenceUrl] = useState<Record<number, string>>({});
  const [evidenceNotes, setEvidenceNotes] = useState<Record<number, string>>(
    {},
  );
  const [evidenceFiles, setEvidenceFiles] = useState<Record<number, File[]>>(
    {},
  );

  const [feedbackMessage, setFeedbackMessage] = useState<
    Record<number, string>
  >({});
  const [feedbackFiles, setFeedbackFiles] = useState<Record<number, File[]>>(
    {},
  );

  const handleSubmitEvidence = async (milestoneIdx: number) => {
    const url = evidenceUrl[milestoneIdx] || "";
    const notes = evidenceNotes[milestoneIdx] || "";
    const files = evidenceFiles[milestoneIdx] || [];

    if (!url && !notes && files.length === 0) {
      toast.error("Provide evidence or attach up to 3 files");
      return;
    }
    if (files.length > 3) {
      toast.error("You can upload a maximum of 3 files");
      return;
    }

    let uploadedPaths: string[] = [];
    try {
      if (files.length) {
        const res = await uploadFiles.mutateAsync({
          payoutId: payout.payout_id,
          milestoneIdx,
          folder: "evidence",
          files,
        });
        uploadedPaths = res.paths || [];
      }
    } catch (e) {
      console.error("Error uploading evidence files:", e);
    }

    const next: Milestone[] = localMilestones.map((m, i) => {
      if (i !== milestoneIdx) return m;
      const newEntry: Evidence = {
        url: url || undefined,
        notes: notes || undefined,
        files: uploadedPaths.length ? uploadedPaths : undefined,
        feedback: [],
      };
      return {
        ...m,
        status: "SUBMITTED",
        evidences: [...(m.evidences || []), newEntry],
      };
    });

    try {
      await updatePayoutMilestones.mutateAsync({
        id: payout.payout_id,
        milestones: next as unknown as Prisma.JsonValue,
      });
      setLocalMilestones(next);
      setEvidenceFiles((prev) => ({ ...prev, [milestoneIdx]: [] }));
      toast.success("Evidence submitted successfully");
    } catch (e) {
      console.error("Error submitting evidence:", e);
      toast.error("Failed to submit evidence. Please try again.");
    }
  };

  const [feedbackTargetIdx, setFeedbackTargetIdx] = useState<
    Record<number, number | null>
  >({});

  const handleSubmitFeedback = async (milestoneIdx: number) => {
    const message = (feedbackMessage[milestoneIdx] || "").trim();
    const files = feedbackFiles[milestoneIdx] || [];
    if (!message) return;
    if (files.length > 3) {
      toast.error("You can upload a maximum of 3 files");
      return;
    }

    let uploadedPaths: string[] = [];
    try {
      if (files.length) {
        const res = await uploadFiles.mutateAsync({
          payoutId: payout.payout_id,
          milestoneIdx,
          folder: "feedback",
          files,
        });
        uploadedPaths = res.paths || [];
      }
    } catch (e) {
      console.error("Error uploading feedback files:", e);
    }

    const next: Milestone[] = localMilestones.map((m, i) => {
      if (i !== milestoneIdx) return m;
      const evidences = [...(m.evidences || [])];
      const targetIdx =
        typeof feedbackTargetIdx[milestoneIdx] === "number"
          ? (feedbackTargetIdx[milestoneIdx] as number)
          : evidences.length - 1;
      if (targetIdx < 0) return m; // cannot add feedback without evidence

      const target = evidences[targetIdx] || { feedback: [] };
      const newFeedback: Feedback = {
        message,
        timestamp: new Date().toISOString(),
        author: user?.email || "Unknown",
        files: uploadedPaths.length ? uploadedPaths : undefined,
      };
      const updatedEntry: Evidence = {
        ...target,
        feedback: [...(target.feedback || []), newFeedback],
      };
      evidences[targetIdx] = updatedEntry;
      return { ...m, evidences };
    });

    try {
      await updatePayoutMilestones.mutateAsync({
        id: payout.payout_id,
        milestones: next as unknown as Prisma.JsonValue,
      });
      setLocalMilestones(next);
      setFeedbackMessage((prev) => ({ ...prev, [milestoneIdx]: "" }));
      setFeedbackFiles((prev) => ({ ...prev, [milestoneIdx]: [] }));
      toast.success("Feedback submitted successfully");
    } catch (e) {
      console.error("Error submitting feedback:", e);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  const handleReject = async (milestoneIdx: number) => {
    if (!canModerate) return;
    const next: Milestone[] = localMilestones.map((m, i) => {
      if (i !== milestoneIdx) return m;
      const prevFlags =
        (m as unknown as { flags?: { approved?: boolean } }).flags || {};
      return {
        ...m,
        status: "REJECTED",
        ...(m as Record<string, unknown>),
        flags: { ...prevFlags, approved: false },
      } as Milestone;
    });
    try {
      await updatePayoutMilestones.mutateAsync({
        id: payout.payout_id,
        milestones: next as unknown as Prisma.JsonValue,
      });
      setLocalMilestones(next);
      toast.success("Milestone rejected");
    } catch (e) {
      console.error("Error rejecting milestone:", e);
      toast.error("Failed to reject milestone. Please try again.");
    }
  };

  const handleApprove = async (milestoneIdx: number) => {
    if (!canModerate) return;
    const next: Milestone[] = localMilestones.map((m, i) => {
      if (i !== milestoneIdx) return m;
      const prevFlags =
        (m as unknown as { flags?: { approved?: boolean } }).flags || {};
      return {
        ...m,
        status: m.status || "PENDING",
        flags: { ...prevFlags, approved: true },
      } as Milestone;
    });
    try {
      await updatePayoutMilestones.mutateAsync({
        id: payout.payout_id,
        milestones: next as unknown as Prisma.JsonValue,
      });
      setLocalMilestones(next);
      toast.success("Milestone approved");
    } catch (e) {
      console.error("Error approving milestone:", e);
      toast.error("Failed to approve milestone. Please try again.");
    }
  };

  const getStatusBadge = (milestone: Milestone) => {
    const approved = Boolean(
      (
        milestone as Record<string, unknown> & {
          flags?: { approved?: boolean };
        }
      ).flags?.approved,
    );
    if (approved) {
      return <Badge variant="success">Approved</Badge>;
    }
    switch (milestone.status) {
      case "SUBMITTED":
        return <Badge>Submitted</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {localMilestones.map((m, idx) => {
        const evidences = (m?.evidences as Evidence[] | undefined) || [];
        return (
          <Card key={idx} className="border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{m.description}</CardTitle>
                  <CardDescription>
                    <span className="font-bold mr-1">Amount:</span>{" "}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(m)}
                  {(canSubmitEvidence || canModerate) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          {canSubmitEvidence ? (
                            <Package className="h-4 w-4 mr-1" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 mr-1" />
                          )}
                          {canSubmitEvidence ? "Submit Evidence" : "Moderate"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {canSubmitEvidence ? "Submit Evidence" : "Moderate"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {canSubmitEvidence && (
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor={`evidence-${idx}`}>
                                  Evidence
                                </Label>
                                <Textarea
                                  id={`evidence-${idx}`}
                                  placeholder="Paste a URL or write a short evidence description"
                                  value={evidenceUrl[idx] || ""}
                                  onChange={(e) =>
                                    setEvidenceUrl((prev) => ({
                                      ...prev,
                                      [idx]: e.target.value,
                                    }))
                                  }
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`evidence-notes-${idx}`}>
                                  Evidence Notes
                                </Label>
                                <Textarea
                                  id={`evidence-notes-${idx}`}
                                  placeholder="Describe your work, provide context, or add any relevant information..."
                                  value={evidenceNotes[idx] || ""}
                                  onChange={(e) =>
                                    setEvidenceNotes((prev) => ({
                                      ...prev,
                                      [idx]: e.target.value,
                                    }))
                                  }
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`evidence-files-${idx}`}>
                                  Attach up to 3 files
                                </Label>
                                <Input
                                  id={`evidence-files-${idx}`}
                                  type="file"
                                  multiple
                                  onChange={(e) =>
                                    setEvidenceFiles((prev) => ({
                                      ...prev,
                                      [idx]: Array.from(
                                        e.target.files || [],
                                      ).slice(0, 3),
                                    }))
                                  }
                                />
                                {(evidenceFiles[idx]?.length || 0) > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    {evidenceFiles[idx]
                                      ?.map((f) => f.name)
                                      .join(", ")}
                                  </div>
                                )}
                              </div>
                              <Button
                                onClick={() => handleSubmitEvidence(idx)}
                                disabled={isUpdatingMilestones}
                                className="w-full"
                              >
                                Submit Evidence
                              </Button>
                            </div>
                          )}

                          {canSubmitEvidence && canModerate && (
                            <div className="border-t border-muted my-4" />
                          )}

                          {canModerate && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`feedback-message-${idx}`}>
                                  Feedback Message
                                </Label>
                                <Textarea
                                  id={`feedback-message-${idx}`}
                                  placeholder="Provide feedback, suggestions, or comments for the grantee..."
                                  value={feedbackMessage[idx] || ""}
                                  onChange={(e) =>
                                    setFeedbackMessage((prev) => ({
                                      ...prev,
                                      [idx]: e.target.value,
                                    }))
                                  }
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`feedback-files-${idx}`}>
                                  Attach up to 3 files
                                </Label>
                                <Input
                                  id={`feedback-files-${idx}`}
                                  type="file"
                                  multiple
                                  onChange={(e) =>
                                    setFeedbackFiles((prev) => ({
                                      ...prev,
                                      [idx]: Array.from(
                                        e.target.files || [],
                                      ).slice(0, 3),
                                    }))
                                  }
                                />
                                {(feedbackFiles[idx]?.length || 0) > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    {feedbackFiles[idx]
                                      ?.map((f) => f.name)
                                      .join(", ")}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleSubmitFeedback(idx)}
                                  disabled={
                                    isUpdatingMilestones ||
                                    !(feedbackMessage[idx] || "").trim()
                                  }
                                  className="w-full"
                                >
                                  Submit Feedback
                                </Button>
                                <div className="flex gap-2">
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleReject(idx)}
                                    disabled={isUpdatingMilestones}
                                    className="flex-1"
                                  >
                                    <ShieldX className="h-4 w-4 mr-2" /> Reject
                                  </Button>
                                  <Button
                                    variant="success"
                                    onClick={() => handleApprove(idx)}
                                    disabled={isUpdatingMilestones}
                                    className="flex-1"
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />{" "}
                                    Approve
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Activity */}
              <div className="space-y-4">
                {evidences.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No threads yet
                  </p>
                )}
                {evidences.map((ev, eIdx) => (
                  <Card key={eIdx} className="space-y-4 p-3">
                    <CardContent className="space-y-4">
                      <CardHeader className="p-0 py-4">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                          <Strikethrough className="h-6 w-6" />
                          Thread {eIdx + 1}
                        </CardTitle>
                      </CardHeader>

                      {/* Evidence Content */}
                      {ev.url && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Evidence Link</h4>
                          <Link
                            href={ev.url}
                            target="_blank"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {ev.url.length > 50
                              ? `${ev.url.substring(0, 50)}...`
                              : ev.url}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      )}

                      {ev.notes && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Notes</h4>
                          <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded border">
                            {ev.notes}
                          </p>
                        </div>
                      )}

                      {/* Files */}
                      {Array.isArray(ev.files) && ev.files.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">
                            Files ({ev.files.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {ev.files.map((p: string, i: number) => (
                              <div
                                key={i}
                                className="border rounded overflow-hidden"
                              >
                                {isImage(p) ? (
                                  <Link href={getPublicUrl(p)} target="_blank">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={getPublicUrl(p)}
                                      alt={p}
                                      className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
                                    />
                                  </Link>
                                ) : (
                                  <div className="p-3 text-center">
                                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                    <Link
                                      href={getPublicUrl(p)}
                                      target="_blank"
                                      className="text-xs text-primary hover:underline block truncate"
                                      title={p.split("/").pop()}
                                    >
                                      {p.split("/").pop()}
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Feedback */}
                      {Array.isArray(ev.feedback) && ev.feedback.length > 0 && (
                        <div className="space-y-3 pt-3 border-t">
                          <h4 className="text-sm font-medium">
                            Feedback ({ev.feedback.length})
                          </h4>
                          <div className="space-y-3">
                            {ev.feedback.map((fb: Feedback, fIdx: number) => (
                              <div
                                key={fIdx}
                                className="bg-muted rounded-2xl p-4 px-6"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">
                                    {fb.author}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {fb.timestamp}
                                  </span>
                                </div>
                                {fb.message && (
                                  <p className="text-sm mb-3">{fb.message}</p>
                                )}
                                {Array.isArray(fb.files) &&
                                  fb.files.length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-xs font-medium text-muted-foreground">
                                        Attachments ({fb.files.length})
                                      </p>
                                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                        {fb.files.map(
                                          (p: string, i: number) => (
                                            <div
                                              key={i}
                                              className="border rounded overflow-hidden"
                                            >
                                              {isImage(p) ? (
                                                <Link
                                                  href={getPublicUrl(p)}
                                                  target="_blank"
                                                >
                                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                                  <img
                                                    src={getPublicUrl(p)}
                                                    alt={p}
                                                    className="w-full h-16 object-cover hover:opacity-90 transition-opacity"
                                                  />
                                                </Link>
                                              ) : (
                                                <div className="p-2 text-center">
                                                  <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                                  <Link
                                                    href={getPublicUrl(p)}
                                                    target="_blank"
                                                    className="text-xs text-primary hover:underline block truncate"
                                                    title={p.split("/").pop()}
                                                  >
                                                    {p.split("/").pop()}
                                                  </Link>
                                                </div>
                                              )}
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
