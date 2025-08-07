import { useAuth } from "@/components/modules/auth/context/AuthContext";
import type { Payout } from "@/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Decimal } from "decimal.js";
import { toast } from "sonner";
import type { PayoutFormValues } from "../schemas/payout.schema";
import { payoutsService } from "../services/payouts.service";

export const usePayoutMutations = () => {
  const queryClient = useQueryClient();
  const { user, payoutProvider } = useAuth();

  const createPayout = useMutation({
    mutationFn: (data: PayoutFormValues) => {
      if (!user || !payoutProvider) {
        console.error("User or payout provider missing:", {
          user,
          payoutProvider,
        });
        throw new Error("User must be a payout provider to create payouts");
      }

      const { grantee_id, ...restData } = data;

      return payoutsService.create({
        ...restData,
        total_funding: new Decimal(data.total_funding),
        created_by: user.user_id,
        grantee_id: data.grantee_id || null,
        image_url: data.image_url || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payouts"],
        refetchType: "active",
      });
    },
    onError: (error: Error) => {
      console.error("Error in createPayout mutation:", error);
      toast.error(error.message || "Failed to create payout");
    },
  });

  const updatePayout = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayoutFormValues }) => {
      const { grantee_id, ...restData } = data;

      return payoutsService.update(id, {
        ...restData,
        total_funding: new Decimal(data.total_funding),
        grantee_id: data.grantee_id || null,
        updated_at: new Date(),
        milestones: data.milestones,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payouts"],
        refetchType: "active",
      });
    },
    onError: (error: Error) => {
      console.error("Error updating payout:", error);
      toast.error(error.message || "Failed to update payout");
    },
  });

  const deletePayout = useMutation({
    mutationFn: (id: string) => payoutsService.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["payouts"] });

      const previousData = queryClient.getQueriesData<{
        data: Payout[];
        total: number;
      }>({
        queryKey: ["payouts"],
      });

      queryClient.setQueriesData<{ data: Payout[]; total: number }>(
        { queryKey: ["payouts"] },
        (old) => {
          if (!old) return old as { data: Payout[]; total: number } | undefined;
          const nextData = old.data.filter((p) => p.payout_id !== id);
          const nextTotal = Math.max(
            0,
            (old.total || 0) - (old.data.length !== nextData.length ? 1 : 0),
          );
          return { ...old, data: nextData, total: nextTotal };
        },
      );

      return { previousData };
    },
    onError: (error: Error, _id, context) => {
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(key as any, data);
        }
      }
      console.error("Error deleting payout:", error);
      toast.error(error.message || "Failed to delete payout");
    },
    onSuccess: () => {
      toast.success("Payout deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["payouts"],
        refetchType: "active",
      });
    },
  });

  const handleCreatePayout = async (data: PayoutFormValues) => {
    try {
      await createPayout.mutateAsync(data);
      return true;
    } catch (error) {
      console.error("Error in handleCreatePayout:", error);
      return false;
    }
  };

  const handleUpdatePayout = async (id: string, data: PayoutFormValues) => {
    try {
      await updatePayout.mutateAsync({ id, data });
      return true;
    } catch {
      return false;
    }
  };

  const handleDeletePayout = async (id: string) => {
    try {
      await deletePayout.mutateAsync(id);
      return true;
    } catch {
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
    isCreating: createPayout.isPending,
    isDeleting: deletePayout.isPending,
  };
};
