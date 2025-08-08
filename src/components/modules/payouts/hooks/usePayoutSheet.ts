import type { GetUserServiceResponse } from "@/@types/responses.entity";
import type { PayoutProvider } from "@/generated/prisma";
import { useCallback, useState } from "react";
import { usePayout } from "../context/PayoutContext";
import { usePayoutMutations } from "./usePayoutMutations";

interface UsePayoutSheetResult {
  isLoading: boolean;
  isLoadingCreator: boolean;
  error: Error | null;
  fetchSelectedGrantee: (userId: string) => Promise<void>;
  fetchCreator: (userId: string) => Promise<void>;
}

export const usePayoutSheet = (): UsePayoutSheetResult => {
  const { setSelectedGrantee, setCreator } = usePayout();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getGranteeById, getPayoutProviderById } = usePayoutMutations();

  const fetchSelectedGrantee = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const result: GetUserServiceResponse = await getGranteeById(userId);

        if (result.exists) {
          setSelectedGrantee(result.user);
          return;
        }
        throw new Error("Grantee not found");
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch grantee"),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [getGranteeById, setSelectedGrantee],
  );

  const fetchCreator = useCallback(
    async (userId: string) => {
      if (!userId) return;

      setIsLoadingCreator(true);
      setError(null);

      try {
        const response = await getPayoutProviderById(userId);

        if (response.success && response.user) {
          setCreator(response.user as PayoutProvider);
          return;
        }
        throw new Error("Failed to fetch creator data");
      } catch (error) {
        console.error("Error fetching creator:", error);
        setError(
          error instanceof Error ? error : new Error("Failed to fetch creator"),
        );
      } finally {
        setIsLoadingCreator(false);
      }
    },
    [getPayoutProviderById, setCreator],
  );

  return {
    isLoading,
    isLoadingCreator,
    error,
    fetchSelectedGrantee,
    fetchCreator,
  };
};
