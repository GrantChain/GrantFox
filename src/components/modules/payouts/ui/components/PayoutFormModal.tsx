import { useInitializeMultiEscrowForm } from "@/components/modules/escrows/hooks/initialize-multi-escrow-form.hook";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalWalletStore } from "@/components/wallet/store/store";
import type { Payout } from "@/generated/prisma";
import { buildEscrowPayload } from "@/utils/build-escrow.utils";
import { useEffect } from "react";
import { toast } from "sonner";
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
  const { setShowCreateModal, setSelectedGrantee } = usePayout();
  const { address } = useGlobalWalletStore();
  const { onSubmit: initializeEscrow } = useInitializeMultiEscrowForm();

  useEffect(() => {
    setSelectedGrantee(null);
  }, [setSelectedGrantee]);

  const handleOpenChange = (newOpen: boolean) => {
    setSelectedGrantee(null);
    onOpenChange(newOpen);
  };

  const handleInitializeEscrow = async (data: PayoutFormValues) => {
    if (data.grantee_id) {
      const payload = buildEscrowPayload(data, address);
      await initializeEscrow(payload);
    }
  };

  const handleCreatePayoutSubmit = async (data: PayoutFormValues) => {
    setSelectedGrantee(null);

    try {
      const [payoutResult, escrowResult] = await Promise.allSettled([
        handleCreatePayout(data),
        data.grantee_id ? handleInitializeEscrow(data) : Promise.resolve(),
      ]);

      if (payoutResult.status === "fulfilled" && payoutResult.value) {
        if (escrowResult.status === "fulfilled") {
          toast.success("Payout created successfully");
        } else if (escrowResult.status === "rejected") {
          toast.error("Payout created but escrow initialization failed");
        }
        setShowCreateModal(false);
      } else {
        toast.error("Failed to create payout");
      }
    } catch (error) {
      console.error("Error in handleCreatePayoutSubmit:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleEditPayout = async (data: PayoutFormValues) => {
    if (!payout) return;
    setSelectedGrantee(null);

    try {
      const [payoutResult, escrowResult] = await Promise.allSettled([
        handleUpdatePayout(payout.payout_id, data),
        data.grantee_id ? handleInitializeEscrow(data) : Promise.resolve(),
      ]);

      if (payoutResult.status === "fulfilled" && payoutResult.value) {
        if (escrowResult.status === "fulfilled") {
          toast.success("Payout updated successfully");
        } else if (escrowResult.status === "rejected") {
          toast.error("Payout updated but escrow initialization failed");
        }
        onOpenChange(false);
      } else {
        toast.error("Failed to update payout");
      }
    } catch (error) {
      console.error("Error in handleEditPayout:", error);
      toast.error("An unexpected error occurred");
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
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};
