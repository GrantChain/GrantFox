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
import { useQueryClient } from "@tanstack/react-query";
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
  const {
    handleCreatePayout,
    handleUpdatePayout,
    handleDeletePayout,
    isUpdating,
    isCreating,
  } = usePayoutMutations();
  const { setShowCreateModal, setSelectedGrantee, selectedGrantee } =
    usePayout();
  const { address } = useGlobalWalletStore();
  const { user } = useAuth();
  const { onSubmit: initializeEscrow, loading: isEscrowLoading } =
    useInitializeMultiEscrowForm();
  const queryClient = useQueryClient();

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

  const handleInitializeEscrow = async (
    data: PayoutFormValues,
  ): Promise<boolean> => {
    if (data.grantee_id && selectedGrantee && user) {
      const payload = await buildEscrowPayload({
        data,
        address,
        payoutProvider: user,
        grantee: selectedGrantee,
      });
      const ok = await initializeEscrow(payload);
      return ok;
    }
    return false;
  };

  const handleCreatePayoutSubmit = async (data: PayoutFormValues) => {
    try {
      if (!selectedGrantee || !user || !data.grantee_id) {
        toast.error("Missing grantee or user to initialize escrow");
        return;
      }
      const payload = {
        ...data,
        grantee_id: selectedGrantee?.user_id || "",
      };

      // Step 1: create payout in DB
      const createdPayout = await handleCreatePayout(payload);
      if (!createdPayout) {
        toast.error("Failed to create payout");
        return;
      }

      // Step 2: initialize escrow on-chain
      const escrowOk = await handleInitializeEscrow(payload);
      if (!escrowOk) {
        toast.error("Escrow initialization failed. Rolling back...");
        if (createdPayout.payout_id) {
          await handleDeletePayout(createdPayout.payout_id, false, true);
        }
        return;
      }

      toast.success("Payout created successfully");
      await queryClient.invalidateQueries({
        queryKey: ["payouts"],
        refetchType: "active",
      });
      setShowCreateModal(false);
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

      // Prefer escrow first to avoid DB update if escrow fails
      const escrowOk = await handleInitializeEscrow(payload);
      if (!escrowOk) {
        toast.error("Escrow initialization failed. No changes were saved.");
        return;
      }

      const updatedOk = await handleUpdatePayout(payout.payout_id, payload);
      if (!updatedOk) {
        toast.error("Failed to update payout after escrow.");
        return;
      }

      toast.success("Payout updated successfully");
      onOpenChange(false);
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
          isSubmitting={isUpdating || isCreating || isEscrowLoading}
          onSubmit={
            mode === "edit" ? handleEditPayout : handleCreatePayoutSubmit
          }
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};
