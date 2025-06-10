import { useUser } from "@/components/modules/auth/context/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Decimal } from "decimal.js";
import { toast } from "sonner";
import type { PayoutFormValues } from "../schemas/payout.schema";
import { payoutsService } from "../services/payouts.service";

export const usePayoutMutations = () => {
  const queryClient = useQueryClient();
  const { user, payoutProvider } = useUser();

  const createPayout = useMutation({
    mutationFn: (data: PayoutFormValues) => {
      if (!user || !payoutProvider) {
        throw new Error("User must be a payout provider to create payouts");
      }

      return payoutsService.create({
        ...data,
        total_funding: new Decimal(data.total_funding),
        created_by: user.user_id,
        grantee_id: null, // TODO: get from the form input email
        image_url: data.image_url || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      toast.success("Payout created successfully");
    },
    onError: (error: Error) => {
      console.error("Error creating payout:", error);
      toast.error(error.message || "Failed to create payout");
    },
  });

  const updatePayout = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayoutFormValues }) => {
      return payoutsService.update(id, {
        ...data,
        total_funding: new Decimal(data.total_funding),
        metrics: data.metrics,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      toast.success("Payout updated successfully");
    },
    onError: (error: Error) => {
      console.error("Error updating payout:", error);
      toast.error(error.message || "Failed to update payout");
    },
  });

  const deletePayout = useMutation({
    mutationFn: (id: string) => {
      return payoutsService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      toast.success("Payout deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Error deleting payout:", error);
      toast.error(error.message || "Failed to delete payout");
    },
  });

  const handleCreatePayout = async (data: PayoutFormValues) => {
    try {
      await createPayout.mutateAsync(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleUpdatePayout = async (id: string, data: PayoutFormValues) => {
    try {
      await updatePayout.mutateAsync({ id, data });
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleDeletePayout = async (id: string) => {
    try {
      await deletePayout.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    createPayout,
    updatePayout,
    deletePayout,
    handleCreatePayout,
    handleUpdatePayout,
    handleDeletePayout,
    isUpdating: updatePayout.isPending,
  };
};
