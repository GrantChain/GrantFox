import { authService } from "@/components/modules/auth/services/auth.service";
import type { Grantee, User } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

interface UserProfileData {
  user: User;
  grantee?: Grantee;
}

const fetchUserProfile = async (userID: string): Promise<UserProfileData> => {
  // First, try to fetch as GRANTEE
  const granteeResponse = await authService.getUserRoleById(userID, "GRANTEE");

  if (granteeResponse.success) {
    const granteeData = granteeResponse.user as Grantee;
    // Fetch user base data
    const userResponse = await authService.getUserById(userID, "GRANTEE");
    if (userResponse.exists) {
      return {
        user: userResponse.user,
        grantee: granteeData,
      };
    }
    // fallback: only grantee data
    return {
      user: granteeData as unknown as User, // fallback, but not ideal
      grantee: granteeData,
    };
  }

  // If not found as GRANTEE, try PAYOUT_PROVIDER
  const providerResponse = await authService.getUserRoleById(
    userID,
    "PAYOUT_PROVIDER",
  );

  if (providerResponse.success) {
    const providerData = providerResponse.user as User;
    return {
      user: providerData,
    };
  }

  // If not found in either role, try basic user fetch
  const basicUserResponse = await authService.getUserById(userID, "GRANTEE");

  if (basicUserResponse.exists) {
    return {
      user: basicUserResponse.user,
    };
  }

  throw new Error("User not found");
};

export const useUserProfile = (params: Promise<{ userID: string }>) => {
  const { userID } = use(params);
  console.log("userID", userID);

  const query = useQuery({
    queryKey: ["user-profile", userID],
    queryFn: () => fetchUserProfile(userID),
    enabled: !!userID,
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors, but not for "User not found"
      if (error.message === "User not found") {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleBack = () => {
    window.history.back();
  };

  return {
    profileData: query.data,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    handleBack,
    isError: query.isError,
    refetch: query.refetch,
  };
};
