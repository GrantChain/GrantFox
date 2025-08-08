import type { DeployResponse } from "@/@types/responses.entity";
import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { useEscrows } from "@/components/modules/escrows/hooks/useEscrows";
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
  const { handleCreatePayout, handleUpdatePayout, isUpdating, isCreating } =
    usePayoutMutations();
  const { setShowCreateModal, setSelectedGrantee, selectedGrantee } =
    usePayout();
  const { address } = useGlobalWalletStore();
  const { user } = useAuth();
  const { handleDeployEscrow, loading: isEscrowLoading } = useEscrows();
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
  ): Promise<DeployResponse> => {
    if (data.grantee_id && selectedGrantee && user) {
      const payload = await buildEscrowPayload({
        data,
        address,
        payoutProvider: user,
        grantee: selectedGrantee,
      });
      const result = await handleDeployEscrow(payload);
      return result;
    }
    return { success: false };
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

      // Step 1: deploy escrow on-chain
      const { success: escrowOk, response: escrow } =
        await handleInitializeEscrow(payload);

      const finalPayload = {
        ...payload,
        escrow_id: escrow?.contractId,
      };

      if (!escrowOk || !escrow) {
        toast.error("Escrow initialization failed.");
        return;
      }

      // Step 2: create payout in DB
      const createdPayout = await handleCreatePayout(finalPayload);
      if (!createdPayout) {
        toast.error("Failed to create payout");
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
