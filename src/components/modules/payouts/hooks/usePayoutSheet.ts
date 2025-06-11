import type { GetUserServiceResponse } from "@/@types/responses.entity";
import type { PayoutProvider } from "@/generated/prisma";
import { useCallback, useState } from "react";
import { authService } from "../../auth/services/auth.service";
import { usePayout } from "../context/PayoutContext";

interface UsePayoutSheetResult {
  isLoading: boolean;
  isLoadingCreator: boolean;
  error: Error | null;
  fetchUser: (userId: string) => Promise<void>;
  fetchCreator: (userId: string) => Promise<void>;
}

export const usePayoutSheet = (): UsePayoutSheetResult => {
  const { setUser, setCreator } = usePayout();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const result: GetUserServiceResponse =
          await authService.getUserById(userId);

        if (result.exists) {
          setUser(result.user);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user"),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setUser],
  );

  const fetchCreator = async (userId: string) => {
    if (!userId) return;

    setIsLoadingCreator(true);
    setError(null);

    try {
      const response = await authService.getUserRoleById(
        userId,
        "PAYOUT_PROVIDER",
      );

      if (response.success && response.user) {
        setCreator(response.user as PayoutProvider);
      } else {
        throw new Error("Failed to fetch creator data");
      }
    } catch (error) {
      console.error("Error fetching creator:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to fetch creator"),
      );
    } finally {
      setIsLoadingCreator(false);
    }
  };

  return {
    isLoading,
    isLoadingCreator,
    error,
    fetchUser,
    fetchCreator,
  };
};
