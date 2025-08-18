"use client";

import { EntityCard } from "@/components/shared/EntityCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format.utils";
import Decimal from "decimal.js";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";

type ReleaseSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  granteeUserId?: string | null;
  granteeName?: string | null;
  granteeImageUrl?: string | null;
  milestoneAmount: number | string | Decimal;
  currency: string;
};

export const ReleaseSuccessDialog = ({
  open,
  onOpenChange,
  granteeUserId,
  granteeName,
  granteeImageUrl,
  milestoneAmount,
  currency,
}: ReleaseSuccessDialogProps) => {
  const amount = new Decimal(milestoneAmount || 0);
  const twFeePct = new Decimal(0.003);
  const rawPlatformPct = Number(process.env.NEXT_PUBLIC_PLATFORM_FEE);
  const platformFeePct = new Decimal(
    isNaN(rawPlatformPct) ? 0 : rawPlatformPct,
  ).div(100);

  const { twFee, platformFee, totalFees, netAmount } = useMemo(() => {
    const twFeeVal = amount.mul(twFeePct);
    const platformFeeVal = amount.mul(platformFeePct);
    const total = twFeeVal.add(platformFeeVal);
    const net = amount.sub(total);
    return {
      twFee: twFeeVal,
      platformFee: platformFeeVal,
      totalFees: total,
      netAmount: net,
    };
  }, [amount, twFeePct, platformFeePct]);

  const format = (val: Decimal) => formatCurrency(currency as never, val);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Funds released successfully
          </DialogTitle>
          <DialogDescription>
            The milestone funds have been sent to the grantee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border p-3">
            <EntityCard
              userId={granteeUserId}
              name={granteeName || undefined}
              imageUrl={granteeImageUrl || undefined}
              size="lg"
            />
          </div>

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary animate-bounce" />
              <span className="text-sm font-medium">Amount details</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Milestone amount</span>
                <span className="font-medium">{format(amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Trustless Work fee (0.3%)
                </span>
                <span>- {format(twFee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  GrantFox fee ({platformFeePct.mul(100).toFixed(2)}%)
                </span>
                <span>- {format(platformFee)}</span>
              </div>
              <div className="border-t my-2" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total fees</span>
                <span className="font-medium">{format(totalFees)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Net to grantee</span>
                <span className="font-semibold">{format(netAmount)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
