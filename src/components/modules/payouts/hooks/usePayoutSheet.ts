import type { GetUserServiceResponse } from "@/@types/responses.entity";
import { useCallback, useState } from "react";
import { authService } from "../../auth/services/auth.service";
import { usePayout } from "../context/PayoutContext";

interface UsePayoutSheetResult {
  isLoading: boolean;
  error: Error | null;
  fetchUser: (userId: string) => Promise<void>;
}

export const usePayoutSheet = (): UsePayoutSheetResult => {
  const { setUser } = usePayout();
  const [isLoading, setIsLoading] = useState(false);
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

  return {
    isLoading,
    error,
    fetchUser,
  };
};
