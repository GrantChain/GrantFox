import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format.utils";
import Decimal from "decimal.js";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FundFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (amount: number) => Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  currency?: string;
  payoutAmount?: Decimal;
}

export function FundFormModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Fund Payout",
  description = "Enter the amount you want to fund this payout.",
  confirmText = "Fund",
  cancelText = "Cancel",
  isLoading = false,
  currency = "USD",
  payoutAmount = new Decimal(0),
}: FundFormModalProps) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const numAmount = Number.parseFloat(amount);

    if (!amount || Number.isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(numAmount);
      setAmount("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error funding payout:", error);
      toast.error("Failed to fund payout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setAmount("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <div className="flex justify-between items-center">
            <DialogDescription>{description}</DialogDescription>
            <div className="text-sm text-muted-foreground font-bold">
              {formatCurrency(currency, new Decimal(payoutAmount || 0))}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({currency})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              disabled={isSubmitting || isLoading}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col md:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting || isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="success"
            disabled={isSubmitting || isLoading || !amount}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Funding...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
