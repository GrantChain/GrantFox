import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Payout } from "@/generated/prisma";
import { useEffect } from "react";
import { usePayout } from "../../context/PayoutContext";
import { usePayoutMutations } from "../../hooks/usePayoutMutations";
import type { PayoutFormValues } from "../../schemas/payout.schema";
import { PayoutForm } from "./PayoutForm";

interface PayoutFormModalProps {
  payout?: Payout;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<PayoutFormValues>;
  mode?: "create" | "edit";
}

export const PayoutFormModal = ({
  payout,
  open,
  onOpenChange,
  initialValues,
  mode = "create",
}: PayoutFormModalProps) => {
  const { handleCreatePayout, handleUpdatePayout, isUpdating, isCreating } =
    usePayoutMutations();
  const { setShowCreateModal, setUser } = usePayout();

  useEffect(() => {
    setUser(null);
  }, [setUser]);

  const handleOpenChange = (newOpen: boolean) => {
    setUser(null);
    onOpenChange(newOpen);
  };

  const handleCreatePayoutSubmit = async (data: PayoutFormValues) => {
    setUser(null);
    const success = await handleCreatePayout(data);
    if (success) {
      setShowCreateModal(false);
    }
  };

  const handleEditPayout = async (data: PayoutFormValues) => {
    if (!payout) return;
    setUser(null);
    const success = await handleUpdatePayout(payout.payout_id, data);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl w-full">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Payout" : "Create Payout"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Edit the details of your payout."
              : "Fill in the details to create a new payout."}
          </DialogDescription>
        </DialogHeader>

        <PayoutForm
          initialValues={initialValues}
          isSubmitting={isUpdating || isCreating}
          onSubmit={
            mode === "edit" ? handleEditPayout : handleCreatePayoutSubmit
          }
        />
      </DialogContent>
    </Dialog>
  );
};
