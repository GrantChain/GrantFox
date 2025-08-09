"use client";

import type { Milestone } from "@/@types/milestones.entity";
import { useAuth } from "@/components/modules/auth/context/AuthContext";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import Decimal from "decimal.js";
import {
  Eye,
  FileText,
  FileUp,
  MessageCircle,
  MessageSquare,
  Paperclip,
  ShieldCheck,
  ShieldX,
  SquareArrowOutUpRight,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMilestoneActions } from "../../hooks/useMilestoneActions";
import { getStatusBadge } from "../../shared/status-badge";

type EvidenceFeedback = {
  message?: string | null;
  timestamp?: string | null;
  author?: string | null;
  files?: string[] | null;
};

type EvidenceEntry = {
  url?: string | null;
  notes?: string | null;
  files?: string[] | null;
  feedback?: EvidenceFeedback[] | null;
  created_at?: string | null;
  author?: string | null;
};

type MilestoneItem = {
  description: string;
  amount: number;
  status?: "PENDING" | "SUBMITTED" | "REJECTED" | "COMPLETED";
  flags?: { approved?: boolean };
  evidences?: EvidenceEntry[] | null;
};

interface ManageMilestonesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payout: Payout;
}

export const ManageMilestonesDialog = ({
  open,
  onOpenChange,
  payout,
}: ManageMilestonesDialogProps) => {
  const initialMilestones = useMemo<MilestoneItem[]>(() => {
    if (!Array.isArray(payout.milestones)) return [];
    return (payout.milestones as unknown[]).map((m) => {
      const base = m as Partial<MilestoneItem> & {
        evidence?: unknown;
        feedback?: unknown;
        files?: unknown;
        filesFeedback?: unknown;
      };

      const legacyEvidence = base.evidence as
        | { url?: string; notes?: string }
        | undefined;
      const legacyFiles = base.files as string[] | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const legacyFeedback = base.feedback as any[] | undefined;
      const legacyFilesFeedback = base.filesFeedback as string[] | undefined;

      const evidences: EvidenceEntry[] | null =
        legacyEvidence || legacyFiles || legacyFeedback || legacyFilesFeedback
          ? [
              {
                url: legacyEvidence?.url ?? null,
                notes: legacyEvidence?.notes ?? null,
                files: legacyFiles ?? null,
                feedback: legacyFeedback
                  ? legacyFeedback.map((f) => ({
                      message: f?.message ?? null,
                      timestamp: f?.timestamp ?? null,
                      author: f?.author ?? null,
                      files: legacyFilesFeedback ?? null,
                    }))
                  : null,
              },
            ]
          : ((base.evidences as EvidenceEntry[] | null) ?? null);

      return {
        description: String(base.description ?? ""),
        amount: Number(base.amount ?? 0),
        status: (base.status as MilestoneItem["status"]) ?? "PENDING",
        flags: base.flags ?? { approved: false },
        evidences,
      };
    });
  }, [payout.milestones]);

  const [localMilestones, setLocalMilestones] =
    useState<MilestoneItem[]>(initialMilestones);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedEvidenceIdx, setSelectedEvidenceIdx] = useState<number | null>(
    null,
  );
  const [evidenceUrl, setEvidenceUrl] = useState<string>("");
  const [evidenceNotes, setEvidenceNotes] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [feedbackFiles, setFeedbackFiles] = useState<File[]>([]);

  const { user } = useAuth();
  const {
    submitEvidence,
    submitFeedback,
    rejectMilestone,
    approveMilestone,
    completeMilestone,
    isUpdatingMilestones,
  } = useMilestoneActions();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    setLocalMilestones(initialMilestones);
    setSelectedIndex(null);
    setSelectedEvidenceIdx(null);
    setEvidenceUrl("");
    setEvidenceNotes("");
    setFeedbackMessage("");
    setEvidenceFiles([]);
    setFeedbackFiles([]);
  }, [open, initialMilestones]);

  // Sync local milestones when payout milestones change
  useEffect(() => {
    setLocalMilestones(initialMilestones);
  }, [initialMilestones]);

  const canSubmitEvidence = user?.role === "GRANTEE";
  const canModerate =
    user?.role === "PAYOUT_PROVIDER" || user?.role === "ADMIN";

  const totalActivityCount = useMemo(() => {
    return localMilestones.reduce((acc, m) => {
      const evCount = (m.evidences || []).length;
      const fbCount = (m.evidences || []).reduce(
        (s, e) => s + (e.feedback?.length || 0),
        0,
      );
      return acc + evCount + fbCount;
    }, 0);
  }, [localMilestones]);

  useEffect(() => {
    if (!open) return;
    const MAX_ACTIVITY_FOR_MODAL = 12;
    if (totalActivityCount > MAX_ACTIVITY_FOR_MODAL) {
      onOpenChange(false);
      const rolePath = user?.role === "GRANTEE" ? "grantee" : "payout-provider";
      router.push(
        `/dashboard/${rolePath}/payouts/${payout.payout_id}/milestones`,
      );
    }
  }, [open, totalActivityCount, payout.payout_id, router, onOpenChange]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const current = localMilestones[index];
    const lastEvidence = current?.evidences?.[current.evidences.length - 1];
    setSelectedEvidenceIdx(
      current?.evidences && current.evidences.length > 0
        ? current.evidences.length - 1
        : null,
    );
    setEvidenceUrl(lastEvidence?.url ?? "");
    setEvidenceNotes(lastEvidence?.notes ?? "");
    setFeedbackMessage("");
    setEvidenceFiles([]);
    setFeedbackFiles([]);
  };

  const handleSubmitEvidence = async () => {
    if (selectedIndex === null) return;
    await submitEvidence({
      payoutId: payout.payout_id,
      milestoneIdx: selectedIndex,
      url: evidenceUrl,
      notes: evidenceNotes,
      files: evidenceFiles,
      // Type cast is safe for our internal usage
      localMilestones: localMilestones as unknown as Milestone[],
      setLocalMilestones: (next) =>
        setLocalMilestones(next as unknown as MilestoneItem[]),
    });
    setEvidenceFiles([]);
  };

  const handleSubmitFeedback = async () => {
    if (selectedIndex === null || !feedbackMessage.trim()) return;
    await submitFeedback({
      payoutId: payout.payout_id,
      milestoneIdx: selectedIndex,
      message: feedbackMessage,
      files: feedbackFiles,
      localMilestones: localMilestones as unknown as Milestone[],
      setLocalMilestones: (next) =>
        setLocalMilestones(next as unknown as MilestoneItem[]),
      selectedEvidenceIdx,
      author: user?.email || undefined,
    });
    setFeedbackMessage("");
    setFeedbackFiles([]);
  };

  const handleReject = async () => {
    if (selectedIndex === null) return;
    await rejectMilestone({
      payoutId: payout.payout_id,
      milestoneIdx: selectedIndex,
      localMilestones: localMilestones as unknown as Milestone[],
      setLocalMilestones: (next) =>
        setLocalMilestones(next as unknown as MilestoneItem[]),
      canModerate,
    });
  };

  const handleComplete = async () => {
    if (selectedIndex === null) return;
    await completeMilestone({
      payoutId: payout.payout_id,
      milestoneIdx: selectedIndex,
      localMilestones: localMilestones as unknown as Milestone[],
      setLocalMilestones: (next) =>
        setLocalMilestones(next as unknown as MilestoneItem[]),
      canModerate: true,
      contractId: payout.escrow_id || undefined,
      serviceProviderAddress: user?.wallet_address || undefined,
    });
  };

  const handleApprove = async () => {
    if (selectedIndex === null) return;
    await approveMilestone({
      payoutId: payout.payout_id,
      milestoneIdx: selectedIndex,
      localMilestones: localMilestones as unknown as Milestone[],
      setLocalMilestones: (next) =>
        setLocalMilestones(next as unknown as MilestoneItem[]),
      canModerate,
      contractId: payout.escrow_id || undefined,
      approverAddress: user?.wallet_address || undefined,
    });
  };

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-7xl w-full max-h-[92vh] p-0 overflow-hidden">
        <DialogHeader className="px-5 py-3 border-b space-y-1">
          <DialogTitle className="text-lg font-semibold leading-none">
            Manage Milestones
          </DialogTitle>
          <DialogDescription className="text-xs">
            Submit evidence and feedback for milestones. Grantees can submit
            evidence; providers can add feedback and approve/reject milestones.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 px-5 py-4">
          <Tabs
            defaultValue="evidence"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="evidence">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="milestones" className="mt-4 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Milestones Overview
                    </CardTitle>
                    <CardDescription>
                      Select a milestone to manage its evidence and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {localMilestones.map((milestone, index) => {
                      const isApproved = Boolean(
                        (
                          milestone as unknown as {
                            flags?: { approved?: boolean };
                          }
                        ).flags?.approved,
                      );
                      const isSelected = selectedIndex === index;
                      const canSelect = !isApproved || canSubmitEvidence;
                      return (
                        <button
                          type="button"
                          key={`${milestone.description}-${index}`}
                          className={`rounded-xl border bg-card text-card-foreground shadow transition-all duration-200 ${
                            canSelect
                              ? `cursor-pointer hover:shadow-md ${
                                  isSelected
                                    ? "ring-2 ring-primary-500/70 border-primary-500/50"
                                    : "hover:border-primary-500/50"
                                }`
                              : "cursor-not-allowed opacity-60"
                          }`}
                          disabled={!canSelect}
                          onClick={() => {
                            if (!canSelect) return;
                            handleSelect(index);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">
                                  {milestone.description}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Amount:{" "}
                                  {formatCurrency(
                                    payout.currency,
                                    new Decimal(milestone.amount),
                                  )}
                                </p>
                                {milestone.evidences &&
                                  milestone.evidences.length > 0 && (
                                    <div className="text-xs text-muted-foreground mt-2">
                                      <p>
                                        <span className="font-bold mr-1">
                                          {milestone.evidences.length}
                                        </span>
                                        {milestone.evidences.length === 1
                                          ? "evidence"
                                          : "evidences"}
                                      </p>
                                    </div>
                                  )}
                              </div>
                              <div className="ml-4">
                                {getStatusBadge(
                                  milestone as unknown as Milestone,
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Actions</CardTitle>
                    <CardDescription>
                      {selectedIndex === null
                        ? "Select a milestone to perform actions"
                        : `Manage milestone: ${localMilestones[selectedIndex]?.description}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedIndex === null ? (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <div className="text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Select a milestone to manage</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Grantee: Show Complete CTA when milestone is approved */}
                        {(() => {
                          const current = localMilestones[selectedIndex];
                          const currentApproved = Boolean(
                            (
                              current as unknown as {
                                flags?: { approved?: boolean };
                              }
                            ).flags?.approved,
                          );
                          if (canSubmitEvidence && currentApproved) {
                            return (
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <h4 className="font-medium">
                                    Mark as completed
                                  </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  This will mark the milestone as completed for
                                  your grant.
                                </p>
                                <Button
                                  onClick={handleComplete}
                                  disabled={isUpdatingMilestones}
                                  className="w-full"
                                >
                                  Complete
                                </Button>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* Evidence Section - Only for Grantees (when not approved) */}
                        {canSubmitEvidence &&
                          (() => {
                            const current = localMilestones[selectedIndex];
                            const isCompleted = current?.status === "COMPLETED";
                            const currentApproved = Boolean(
                              (
                                current as unknown as {
                                  flags?: { approved?: boolean };
                                }
                              ).flags?.approved,
                            );
                            if (currentApproved || isCompleted) return null;
                            return (
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <h4 className="font-medium">
                                    Submit Evidence
                                  </h4>
                                </div>
                                <div className="space-y-3">
                                  <Label htmlFor="evidence">Evidence</Label>
                                  <Textarea
                                    id="evidence"
                                    placeholder="Paste a URL or write a short evidence description"
                                    value={evidenceUrl}
                                    onChange={(e) =>
                                      setEvidenceUrl(e.target.value)
                                    }
                                    rows={2}
                                  />
                                </div>
                                <div className="space-y-3">
                                  <Label htmlFor="evidence-notes">
                                    Evidence Notes
                                  </Label>
                                  <Textarea
                                    id="evidence-notes"
                                    placeholder="Describe your work, provide context, or add any relevant information..."
                                    value={evidenceNotes}
                                    onChange={(e) =>
                                      setEvidenceNotes(e.target.value)
                                    }
                                    rows={3}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="evidence-files">
                                    Attach up to 3 files
                                  </Label>
                                  <Input
                                    id="evidence-files"
                                    type="file"
                                    multiple
                                    onChange={(e) =>
                                      setEvidenceFiles(
                                        Array.from(e.target.files || []).slice(
                                          0,
                                          3,
                                        ),
                                      )
                                    }
                                  />
                                  {evidenceFiles.length > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      {evidenceFiles
                                        .map((f) => f.name)
                                        .join(", ")}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  onClick={handleSubmitEvidence}
                                  disabled={
                                    isUpdatingMilestones ||
                                    selectedIndex === null
                                  }
                                  className="w-full"
                                >
                                  <FileUp className="h-4 w-4 mr-2" />
                                  Submit Evidence
                                </Button>
                              </div>
                            );
                          })()}

                        {/* Feedback Section - For Payout Providers */}
                        {canModerate && (
                          <div className="space-y-4">
                            <Separator />
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              <h4 className="font-medium">Add Feedback</h4>
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="feedback-message">
                                Feedback Message
                              </Label>
                              <Textarea
                                id="feedback-message"
                                placeholder="Provide feedback, suggestions, or comments for the grantee..."
                                value={feedbackMessage}
                                onChange={(e) =>
                                  setFeedbackMessage(e.target.value)
                                }
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="feedback-files">
                                Attach up to 3 files
                              </Label>
                              <Input
                                id="feedback-files"
                                type="file"
                                multiple
                                onChange={(e) =>
                                  setFeedbackFiles(
                                    Array.from(e.target.files || []).slice(
                                      0,
                                      3,
                                    ),
                                  )
                                }
                              />
                              {feedbackFiles.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {feedbackFiles.map((f) => f.name).join(", ")}
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={handleSubmitFeedback}
                              disabled={
                                isUpdatingMilestones ||
                                selectedIndex === null ||
                                !feedbackMessage.trim()
                              }
                              variant="outline"
                              className="w-full"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Submit Feedback
                            </Button>
                          </div>
                        )}

                        {/* Moderation Actions - For Payout Providers */}
                        {canModerate && (
                          <div className="space-y-4">
                            <Separator />
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4" />
                              <h4 className="font-medium">
                                Moderation Actions
                              </h4>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={
                                  isUpdatingMilestones || selectedIndex === null
                                }
                                className="flex-1"
                              >
                                <ShieldX className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                variant="success"
                                onClick={handleApprove}
                                disabled={
                                  isUpdatingMilestones || selectedIndex === null
                                }
                                className="flex-1"
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="evidence" className="mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Evidence & Feedback
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Quick overview - use full view for details
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 hover:bg-primary/10"
                      onClick={() => {
                        const rolePath =
                          user?.role === "GRANTEE"
                            ? "grantee"
                            : "payout-provider";
                        router.push(
                          `/dashboard/${rolePath}/payouts/${payout.payout_id}/milestones`,
                        );
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Full view
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="max-h-64 overflow-hidden">
                  {localMilestones.length === 0 ? (
                    <Card className="text-center py-6 space-y-2 p-3">
                      <div className="mx-auto w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          No milestones found
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Evidence will appear once milestones are created
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 space-y-3 mt-4">
                      {localMilestones.slice(0, 2).map((milestone, mIdx) => (
                        <Card
                          key={mIdx}
                          className="space-y-2 p-3 min-h-20 !mt-0"
                        >
                          {/* Compact Milestone Header */}
                          <div className="flex items-center gap-2 pb-1 border-b border-muted/50">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {mIdx + 1}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-foreground truncate">
                              {milestone.description}
                            </h4>
                          </div>

                          {/* Compact Evidence Summary */}
                          <div className="ml-7 text-xs text-muted-foreground">
                            {(milestone.evidences || []).length === 0 ? (
                              <span>No evidence submitted</span>
                            ) : (
                              <div className="flex items-center gap-4">
                                <span>
                                  {milestone.evidences?.length} evidence items
                                </span>
                                {milestone.evidences?.some(
                                  (ev) => ev.files && ev.files.length > 0,
                                ) && (
                                  <span className="flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" />
                                    {milestone.evidences?.reduce(
                                      (acc, ev) =>
                                        acc + (ev.files?.length || 0),
                                      0,
                                    )}{" "}
                                    files
                                  </span>
                                )}
                                {milestone.evidences?.some(
                                  (ev) => ev.feedback && ev.feedback.length > 0,
                                ) && (
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    {milestone.evidences?.reduce(
                                      (acc, ev) =>
                                        acc + (ev.feedback?.length || 0),
                                      0,
                                    )}{" "}
                                    comments
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}

                      {localMilestones.length > 2 && (
                        <div className="pt-2 border-t border-muted/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              const rolePath =
                                user?.role === "GRANTEE"
                                  ? "grantee"
                                  : "payout-provider";
                              router.push(
                                `/dashboard/${rolePath}/payouts/${payout.payout_id}/milestones`,
                              );
                            }}
                          >
                            +{localMilestones.length - 2} more milestones - View
                            all
                            <SquareArrowOutUpRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
