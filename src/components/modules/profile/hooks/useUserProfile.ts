import { authService } from "@/components/modules/auth/services/auth.service";
import type { Grantee, PayoutProvider, User } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

interface UserProfileData {
  user: User;
  grantee?: Grantee;
  payoutProvider?: PayoutProvider;
}

const fetchUserProfile = async (userID: string): Promise<UserProfileData> => {
  // Get user data without role filtering
  const userResponse = await authService.getUserById(userID);

  if (!userResponse.exists) {
    throw new Error("User not found");
  }

  const userData = userResponse.user;
  const userRole = userData.role;

  // Now that we have the user and know their role, fetch role-specific data
  if (userRole === "GRANTEE") {
    const granteeResponse = await authService.getUserRoleById(
      userID,
      "GRANTEE",
    );

    if (granteeResponse.success) {
      return {
        user: userData,
        grantee: granteeResponse.user as Grantee,
      };
    }
    // If we can't get grantee data, just return user data
    return {
      user: userData,
    };
  } else if (userRole === "PAYOUT_PROVIDER") {
    const providerResponse = await authService.getUserRoleById(
      userID,
      "PAYOUT_PROVIDER",
    );

    if (providerResponse.success) {
      return {
        user: userData,
        payoutProvider: providerResponse.user as PayoutProvider,
      };
    }
    // If we can't get provider data, just return user data
    return {
      user: userData,
    };
  }

  // Fallback: return just user data
  return {
    user: userData,
  };
};

export const useUserProfile = (params: Promise<{ userID: string }>) => {
  const { userID } = use(params);

  const query = useQuery({
    queryKey: ["user-profile", userID],
    queryFn: () => fetchUserProfile(userID),
    enabled: !!userID,
    retry: 3, // Simple retry 3 times
    retryDelay: 1000, // Fixed 1 second delay
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
