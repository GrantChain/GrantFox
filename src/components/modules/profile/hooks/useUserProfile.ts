import { authService } from "@/components/modules/auth/services/auth.service";
import type {
  Grantee,
  PayoutProvider,
  User,
  UserRole,
} from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

interface UserProfileData {
  user: User;
  grantee?: Grantee;
  payoutProvider?: PayoutProvider;
}

const fetchUserProfile = async (userID: string): Promise<UserProfileData> => {
  // Fetch user and include role in the response by using role=EMPTY
  const userResponse = await authService.getUserById(
    userID,
    "EMPTY" as UserRole,
  );

  if (!userResponse.exists) {
    throw new Error("User not found");
  }

  const userData = userResponse.user as User & { role: UserRole };
  const userRole = userData.role as UserRole;

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
  }

  if (userRole === "PAYOUT_PROVIDER") {
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
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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

export const usePublicProfile = (userID: string) => {
  const query = useQuery({
    queryKey: ["user-profile", userID],
    queryFn: () => fetchUserProfile(userID),
    enabled: !!userID,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    profileData: query.data,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};
