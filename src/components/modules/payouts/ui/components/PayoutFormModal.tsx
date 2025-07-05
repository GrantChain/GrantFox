import { useAuth } from "@/components/modules/auth/context/AuthContext";
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
  const { setShowCreateModal, setSelectedGrantee, selectedGrantee } =
    usePayout();
  const { address } = useGlobalWalletStore();
  const { user } = useAuth();
  const { onSubmit: initializeEscrow } = useInitializeMultiEscrowForm();

  useEffect(() => {
    if (mode === "create") {
      setSelectedGrantee(null);
    }
  }, [setSelectedGrantee, mode]);

  const handleOpenChange = (newOpen: boolean) => {
    if (mode === "create") {
      setSelectedGrantee(null);
    }
    onOpenChange(newOpen);
  };

  const handleInitializeEscrow = async (data: PayoutFormValues) => {
    if (data.grantee_id && selectedGrantee && user) {
      const payload = await buildEscrowPayload({
        data,
        address,
        payoutProvider: user,
        grantee: selectedGrantee,
      });
      await initializeEscrow(payload);
    }
  };

  const handleCreatePayoutSubmit = async (data: PayoutFormValues) => {
    try {
      const payload = {
        ...data,
        grantee_id: selectedGrantee?.user_id || "",
      };

      const [payoutResult, escrowResult] = await Promise.allSettled([
        handleCreatePayout(payload),
        handleInitializeEscrow(payload),
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
    } finally {
      setSelectedGrantee(null);
    }
  };

  const handleEditPayout = async (data: PayoutFormValues) => {
    if (!payout) return;

    try {
      const payload = {
        ...data,
        grantee_id: data.grantee_id || payout.grantee_id || "",
      };

      const [payoutResult, escrowResult] = await Promise.allSettled([
        handleUpdatePayout(payout.payout_id, payload),
        handleInitializeEscrow(payload),
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
    } finally {
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
