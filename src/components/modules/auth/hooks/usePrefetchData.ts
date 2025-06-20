import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { payoutsService } from "../../payouts/services/payouts.service";
import { useAuth } from "../context/AuthContext";

export const usePrefetchData = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.user_id) return;

    // Prefetch payouts data
    const prefetchPayouts = async () => {
      try {
        await queryClient.prefetchQuery({
          queryKey: [
            "payouts",
            {},
            { page: 1, pageSize: 10 },
            user.role,
            user.user_id,
          ],
          queryFn: () =>
            payoutsService.findAll(
              {},
              { page: 1, pageSize: 10 },
              user.role,
              user.user_id,
            ),
          staleTime: 30 * 1000,
        });
      } catch (error) {
        // Silently fail prefetch
        console.debug("Prefetch failed:", error);
      }
    };

    prefetchPayouts();
  }, [user?.user_id, user?.role, queryClient]);
};
