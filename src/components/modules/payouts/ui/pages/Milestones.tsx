"use client";

import type { Evidence, Feedback, Milestone } from "@/@types/milestones.entity";
import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { useEscrowResolutionWatch } from "@/components/modules/escrows/hooks/useEscrowResolutionWatch";
import { PayoutContext } from "@/components/modules/payouts/context/PayoutContext";
import { usePayouts } from "@/components/modules/payouts/hooks/usePayouts";
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
import { formatCurrency } from "@/utils/format.utils";
import { getPublicUrl } from "@/utils/images.utils";
import { isImage } from "@/utils/is-valid.utils";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import {
  ExternalLink,
  FileText,
  Package,
  PiggyBank,
  ShieldCheck,
  ShieldX,
  Strikethrough,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { useMilestoneActions } from "../../hooks/useMilestoneActions";
import { usePayoutMutations } from "../../hooks/usePayoutMutations";
import { payoutsService } from "../../services/payouts.service";
import { getStatusBadge } from "../../shared/status-badge";
import MilestoneCardSkeleton from "../components/MilestoneCardSkeleton";

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

  // no-eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isChecking: isCheckingEscrowResolution, checkEscrowResolution } =
    useEscrowResolutionWatch({
      payout: payout || ({} as Payout),
      enabled: Boolean(payout?.escrow_id),
    });

  useEffect(() => {
    if (payout?.escrow_id) {
      checkEscrowResolution();
    }
  }, [payout?.escrow_id, checkEscrowResolution]);

  const isLoading =
    isAuthLoading || isListLoading || isListFetching || isOneLoading;
  const error = listError || oneError;

  if (isLoading) {
    return (
      <div className="container py-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 w-full max-w-[70%] space-y-2">
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MilestoneCardSkeleton key={i} />
          ))}
        </div>
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
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold truncate">{payout.title}</h1>
        <p className="text-xs text-muted-foreground">
          Milestones management, evidence & feedback
        </p>
      </div>
    </div>
  );
};

const MilestonesList = ({ payout }: { payout: Payout }) => {
  const { user } = useAuth();
  const payoutCtx = useContext(PayoutContext);
  const canSubmitEvidence = user?.role === "GRANTEE";
  const canModerate =
    user?.role === "PAYOUT_PROVIDER" || user?.role === "ADMIN";
  const { isUpdatingMilestones } = usePayoutMutations();
  const {
    submitEvidence,
    submitFeedback,
    rejectMilestone,
    approveMilestone,
    completeMilestone,
    releaseMilestone,
  } = useMilestoneActions();

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

  const escrowId = payout.escrow_id || "";
  const escrowBalance =
    escrowId && payoutCtx ? payoutCtx.escrowBalances[escrowId] || 0 : 0;
  const hasEscrowBalance = (escrowBalance || 0) > 0;

  useEffect(() => {
    if (!escrowId || !payoutCtx) return;
    payoutCtx.fetchEscrowBalances([escrowId]).catch(() => {});
  }, [escrowId, payoutCtx]);

  const handleSubmitEvidence = async (milestoneIdx: number) => {
    await submitEvidence({
      payoutId: payout.payout_id,
      milestoneIdx,
      url: evidenceUrl[milestoneIdx] || "",
      notes: evidenceNotes[milestoneIdx] || "",
      files: evidenceFiles[milestoneIdx] || [],
      localMilestones,
      setLocalMilestones,
    });
    setEvidenceFiles((prev) => ({ ...prev, [milestoneIdx]: [] }));
  };

  const handleComplete = async (milestoneIdx: number) => {
    if (milestoneIdx === null) return;
    await completeMilestone({
      payoutId: payout.payout_id,
      milestoneIdx: milestoneIdx,
      localMilestones: localMilestones as unknown as Milestone[],
      setLocalMilestones: (next) =>
        setLocalMilestones(next as unknown as Milestone[]),
      canModerate: true,
      contractId: payout.escrow_id || undefined,
      serviceProviderAddress: user?.wallet_address || undefined,
    });
  };

  const [feedbackTargetIdx] = useState<Record<number, number | null>>({});

  const handleSubmitFeedback = async (milestoneIdx: number) => {
    await submitFeedback({
      payoutId: payout.payout_id,
      milestoneIdx,
      message: feedbackMessage[milestoneIdx] || "",
      files: feedbackFiles[milestoneIdx] || [],
      localMilestones,
      setLocalMilestones,
      selectedEvidenceIdx:
        typeof feedbackTargetIdx[milestoneIdx] === "number"
          ? (feedbackTargetIdx[milestoneIdx] as number)
          : undefined,
      author: user?.email || undefined,
    });
    setFeedbackMessage((prev) => ({ ...prev, [milestoneIdx]: "" }));
    setFeedbackFiles((prev) => ({ ...prev, [milestoneIdx]: [] }));
  };

  const handleReject = async (milestoneIdx: number) => {
    await rejectMilestone({
      payoutId: payout.payout_id,
      milestoneIdx,
      localMilestones,
      setLocalMilestones,
      canModerate,
      contractId: payout.escrow_id || undefined,
    });
  };

  const handleApprove = async (milestoneIdx: number) => {
    await approveMilestone({
      payoutId: payout.payout_id,
      milestoneIdx,
      localMilestones,
      setLocalMilestones,
      canModerate,
      contractId: payout.escrow_id || undefined,
      approverAddress: user?.wallet_address || undefined,
    });
  };

  const handleRelease = async (milestoneIdx: number) => {
    await releaseMilestone({
      payoutId: payout.payout_id,
      milestoneIdx,
      localMilestones,
      setLocalMilestones,
      canModerate,
      contractId: payout.escrow_id || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {localMilestones.map((m, idx) => {
        const evidences = (m?.evidences as Evidence[] | undefined) || [];
        const isApproved = Boolean(
          (
            m as unknown as {
              flags?: { approved?: boolean };
            }
          ).flags?.approved,
        );
        const isCompleted = m.status === "COMPLETED";
        const flags =
          (
            m as unknown as {
              flags?: {
                approved?: boolean;
                disputed?: boolean;
                released?: boolean;
                resolved?: boolean;
              };
            }
          ).flags || {};
        const isDisputed = Boolean(flags.disputed);
        const isReleased = Boolean(flags.released);
        const isResolved = Boolean(flags.resolved);
        const hasEvidence = evidences.length > 0;
        const canLeaveFeedback =
          canModerate &&
          hasEvidence &&
          !isCompleted &&
          !isReleased &&
          !isResolved &&
          !isDisputed;
        const canShowApproveReject = canLeaveFeedback;
        const canShowRelease =
          canModerate && isCompleted && !isReleased && !isResolved;
        const moderateDisabled = canSubmitEvidence
          ? isDisputed || isReleased || isResolved || isCompleted
          : !canLeaveFeedback;
        return (
          <Card key={idx} className="border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex flex-col justify-start items-start gap-2">
                  <CardTitle className="text-lg">{m.description}</CardTitle>
                  <CardDescription>
                    <span className="font-bold mr-1">Amount:</span>{" "}
                    {formatCurrency(payout.currency, new Decimal(m.amount))}
                  </CardDescription>
                  {getStatusBadge(m)}
                </div>
                <div className="flex items-center gap-2">
                  {canModerate && !isCompleted && (
                    <>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(idx)}
                        disabled={
                          isUpdatingMilestones ||
                          !canShowApproveReject ||
                          !hasEscrowBalance
                        }
                      >
                        <ShieldX className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(idx)}
                        disabled={isUpdatingMilestones || !canShowApproveReject}
                      >
                        <ShieldCheck className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </>
                  )}
                  {canModerate && canShowRelease && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleRelease(idx)}
                      disabled={isUpdatingMilestones || !hasEscrowBalance}
                    >
                      <PiggyBank className="h-4 w-4 mr-1" />
                      Release
                    </Button>
                  )}
                  {canSubmitEvidence &&
                  isApproved &&
                  !isCompleted &&
                  !isDisputed &&
                  !isReleased &&
                  !isResolved ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleComplete(idx)}
                      disabled={isUpdatingMilestones}
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Mark as completed
                    </Button>
                  ) : (
                    ((canSubmitEvidence && !isCompleted) || canModerate) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={moderateDisabled}
                            aria-disabled={moderateDisabled}
                            className={
                              moderateDisabled
                                ? "pointer-events-none opacity-60"
                                : ""
                            }
                          >
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
                              {canSubmitEvidence
                                ? "Submit Evidence"
                                : "Moderate"}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {canSubmitEvidence &&
                              !isDisputed &&
                              !isReleased &&
                              !isResolved &&
                              !isCompleted && (
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

                            {canSubmitEvidence &&
                              canModerate &&
                              hasEvidence &&
                              !isCompleted &&
                              !isReleased &&
                              !isResolved && (
                                <div className="border-t border-muted my-4" />
                              )}

                            {canModerate &&
                              hasEvidence &&
                              !isCompleted &&
                              !isReleased &&
                              !isResolved && (
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
                                        !(feedbackMessage[idx] || "").trim() ||
                                        !hasEvidence
                                      }
                                      className="w-full"
                                    >
                                      Submit Feedback
                                    </Button>
                                  </div>
                                </div>
                              )}

                            {/* Moderation actions moved out of modal on page view */}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )
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
