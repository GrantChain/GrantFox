"use client";

import type { Milestone } from "@/@types/milestones.entity";
import type { Payout } from "@/generated/prisma";
import type { Prisma } from "@/generated/prisma";
import { useCallback, useRef, useState } from "react";
import { useEscrows } from "../../escrows/hooks/useEscrows";
import { usePayout } from "../../payouts/context/PayoutContext";
import { usePayoutMutations } from "../../payouts/hooks/usePayoutMutations";

type UseEscrowResolutionWatchArgs = {
  payout: Payout;
  enabled?: boolean;
};

type CheckResult = {
  updatedIndices: number[];
};

export const useEscrowResolutionWatch = ({
  payout,
  enabled = true,
}: UseEscrowResolutionWatchArgs) => {
  const { handleGetEscrowByContractIds } = useEscrows();
  const { fetchEscrowBalances } = usePayout();
  const { updatePayoutMilestones } = usePayoutMutations();

  const [isChecking, setIsChecking] = useState(false);
  const lastCheckedAtRef = useRef<number>(0);
  const lastEscrowIdRef = useRef<string | null>(null);

  const STALE_MS = 30 * 1000;

  const checkEscrowResolution = useCallback(
    async (force?: boolean): Promise<CheckResult> => {
      const escrowId = payout?.escrow_id || "";
      if (!enabled || !escrowId) return { updatedIndices: [] };

      const now = Date.now();
      if (
        lastEscrowIdRef.current === escrowId &&
        !force &&
        now - lastCheckedAtRef.current < STALE_MS
      ) {
        return { updatedIndices: [] };
      }

      setIsChecking(true);
      try {
        const escrow = await handleGetEscrowByContractIds([escrowId]);
        const escrowItem = Array.isArray(escrow) ? escrow[0] : escrow;
        const milestonesFromEscrow = (escrowItem?.milestones || []) as Array<{
          flags?: { resolved?: boolean };
        }>;

        const currentMilestones = (payout?.milestones ||
          []) as unknown as Milestone[];
        const updatedIndices: number[] = [];

        const nextMilestones = currentMilestones.map((m, idx) => {
          const escrowResolved = Boolean(
            (
              milestonesFromEscrow[idx]?.flags as
                | { resolved?: boolean }
                | undefined
            )?.resolved,
          );
          if (!escrowResolved) return m;

          const prevFlags =
            (m as unknown as { flags?: { resolved?: boolean } }).flags || {};
          if (prevFlags.resolved === true) return m;

          updatedIndices.push(idx);
          return {
            ...m,
            ...(m as Record<string, unknown>),
            flags: { ...prevFlags, resolved: true },
          } as Milestone;
        });

        if (updatedIndices.length > 0) {
          await updatePayoutMilestones.mutateAsync({
            id: payout.payout_id,
            milestones: nextMilestones as unknown as Prisma.JsonValue,
          });

          await fetchEscrowBalances([escrowId], { force: true });
        }

        lastCheckedAtRef.current = now;
        lastEscrowIdRef.current = escrowId;

        return { updatedIndices };
      } finally {
        setIsChecking(false);
      }
    },
    [
      enabled,
      payout?.escrow_id,
      payout?.milestones,
      payout?.payout_id,
      handleGetEscrowByContractIds,
      updatePayoutMilestones,
      fetchEscrowBalances,
    ],
  );

  return { isChecking, checkEscrowResolution };
};
