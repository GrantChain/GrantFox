"use client";

import type { Evidence, Feedback, Milestone } from "@/@types/milestones.entity";
import { useEscrows } from "@/components/modules/escrows/hooks/useEscrows";
import type { Payout } from "@/generated/prisma";
import type { Prisma } from "@/generated/prisma";
import { toast } from "sonner";
import { usePayoutMutations } from "./usePayoutMutations";

type SubmitEvidenceArgs = {
  payoutId: Payout["payout_id"];
  milestoneIdx: number;
  url: string;
  notes: string;
  files: File[];
  localMilestones: Milestone[];
  setLocalMilestones: (next: Milestone[]) => void;
};

type SubmitFeedbackArgs = {
  payoutId: Payout["payout_id"];
  milestoneIdx: number;
  message: string;
  files: File[];
  localMilestones: Milestone[];
  setLocalMilestones: (next: Milestone[]) => void;
  selectedEvidenceIdx?: number | null;
  author?: string;
};

type ModerateArgs = {
  payoutId: Payout["payout_id"];
  milestoneIdx: number;
  localMilestones: Milestone[];
  setLocalMilestones: (next: Milestone[]) => void;
  canModerate: boolean;
};

type ApproveArgs = ModerateArgs & {
  contractId?: string | null;
  approverAddress?: string | null;
};

type CompleteArgs = ModerateArgs & {
  contractId?: string | null;
  serviceProviderAddress?: string | null;
};

export const useMilestoneActions = () => {
  const { updatePayoutMilestones, uploadFiles, isUpdatingMilestones } =
    usePayoutMutations();
  const { handleApproveMilestone, handleCompleteMilestone } = useEscrows();

  const completeMilestone = async (args: CompleteArgs) => {
    const {
      payoutId,
      milestoneIdx,
      localMilestones,
      setLocalMilestones,
      contractId,
      serviceProviderAddress,
    } = args;

    const next: Milestone[] = localMilestones.map((m, i) => {
      if (i !== milestoneIdx) return m;
      return {
        ...m,
        status: "COMPLETED",
      } as Milestone;
    });

    try {
      if (contractId) {
        const current = localMilestones[milestoneIdx];
        const allEvidences = (current?.evidences || []) as Evidence[];
        const newEvidence = allEvidences
          .map((ev, idx) => {
            const parts: string[] = [];
            if (ev?.url) parts.push(`url=@${ev.url}`);
            const filesArray = Array.isArray(ev?.files) ? ev.files : [];
            if (filesArray.length === 1) {
              parts.push(`file=${filesArray[0]}`);
            } else if (filesArray.length > 1) {
              parts.push(`files=${filesArray.join(";")}`);
            }
            if (ev?.notes) parts.push(`notes=${ev.notes}`);
            const joined = parts.join("&");
            return `${idx + 1}:${joined}`;
          })
          .join(", ");

        const result = await handleCompleteMilestone({
          contractId,
          milestoneIndex: String(milestoneIdx),
          serviceProvider: serviceProviderAddress || "",
          newStatus: "COMPLETED",
          newEvidence,
        });

        if (!result) {
          toast.error("Failed to approve milestone");
          return;
        }
      }

      await updatePayoutMilestones.mutateAsync({
        id: payoutId,
        milestones: next as unknown as Prisma.JsonValue,
      });

      setLocalMilestones(next);
      toast.success("Milestone marked as completed");
    } catch (e) {
      console.error("Error marking milestone as completed:", e);
      toast.error("Failed to mark as completed. Please try again.");
    }
  };

  const submitEvidence = async (args: SubmitEvidenceArgs) => {
    const {
      payoutId,
      milestoneIdx,
      url,
      notes,
      files,
      localMilestones,
      setLocalMilestones,
    } = args;

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
          payoutId,
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
        id: payoutId,
        milestones: next as unknown as Prisma.JsonValue,
      });
      setLocalMilestones(next);
      toast.success("Evidence submitted successfully");
    } catch (e) {
      console.error("Error submitting evidence:", e);
      toast.error("Failed to submit evidence. Please try again.");
    }
  };

  const submitFeedback = async (args: SubmitFeedbackArgs) => {
    const {
      payoutId,
      milestoneIdx,
      message,
      files,
      localMilestones,
      setLocalMilestones,
      selectedEvidenceIdx,
      author,
    } = args;

    const trimmed = (message || "").trim();
    if (!trimmed) return;
    if (files.length > 3) {
      toast.error("You can upload a maximum of 3 files");
      return;
    }

    let uploadedPaths: string[] = [];
    try {
      if (files.length) {
        const res = await uploadFiles.mutateAsync({
          payoutId,
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
        typeof selectedEvidenceIdx === "number"
          ? selectedEvidenceIdx
          : evidences.length - 1;
      if (targetIdx < 0) return m;

      const target = evidences[targetIdx] || { feedback: [] };
      const newFeedback: Feedback = {
        message: trimmed,
        timestamp: new Date().toISOString(),
        author: author || "Unknown",
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
        id: payoutId,
        milestones: next as unknown as Prisma.JsonValue,
      });
      setLocalMilestones(next);
      toast.success("Feedback submitted successfully");
    } catch (e) {
      console.error("Error submitting feedback:", e);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  const rejectMilestone = async (args: ModerateArgs) => {
    const {
      payoutId,
      milestoneIdx,
      localMilestones,
      setLocalMilestones,
      canModerate,
    } = args;
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
        id: payoutId,
        milestones: next as unknown as Prisma.JsonValue,
      });
      setLocalMilestones(next);
      toast.success("Milestone rejected");
    } catch (e) {
      console.error("Error rejecting milestone:", e);
      toast.error("Failed to reject milestone. Please try again.");
    }
  };

  const approveMilestone = async (args: ApproveArgs) => {
    const {
      payoutId,
      milestoneIdx,
      localMilestones,
      setLocalMilestones,
      canModerate,
      contractId,
      approverAddress,
    } = args;
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
      if (contractId) {
        const result = await handleApproveMilestone({
          contractId,
          milestoneIndex: String(milestoneIdx),
          approver: approverAddress || "",
          newFlag: true,
        });

        if (!result) {
          toast.error("Failed to approve milestone");
          return;
        }
      }

      await updatePayoutMilestones.mutateAsync({
        id: payoutId,
        milestones: next as unknown as Prisma.JsonValue,
      });
      setLocalMilestones(next);
      toast.success("Milestone approved");
    } catch (e) {
      console.error("Error approving milestone:", e);
      toast.error("Failed to approve milestone. Please try again.");
    }
  };

  return {
    completeMilestone,
    submitEvidence,
    submitFeedback,
    rejectMilestone,
    approveMilestone,
    isUpdatingMilestones,
  };
};
