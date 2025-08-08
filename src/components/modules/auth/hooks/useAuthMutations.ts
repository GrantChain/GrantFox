import { authService } from "@/components/modules/auth/services/auth.service";
import type {
  Grantee,
  PayoutProvider,
  User,
  UserRole,
} from "@/generated/prisma";
import { http } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UserResponse {
  exists: boolean;
  user: User;
}

interface RoleDataResponse {
  exists: boolean;
  user: Grantee | PayoutProvider;
}

export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  const useUserRole = (userId: string) => {
    return useQuery({
      queryKey: ["user-role", userId],
      queryFn: async () => {
        const response = await authService.checkRole(userId);
        if (!response.success || !response.role) {
          throw new Error("No role found for user");
        }
        return response.role;
      },
      enabled: !!userId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };

  const useUserData = (userId: string, role: string) => {
    return useQuery({
      queryKey: ["user-data", userId, role],
      queryFn: async () => {
        const params =
          role === "EMPTY" ? { user_id: userId } : { user_id: userId, role };

        const response = await http.get<UserResponse>("/get-user-by-id", {
          params,
        });
        if (!response.data.exists || !response.data.user) {
          throw new Error("No user data found");
        }
        return {
          ...response.data.user,
          role: role as UserRole,
        };
      },
      enabled: !!userId && !!role,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };

  const useRoleData = (userId: string, role: string) => {
    return useQuery({
      queryKey: ["role-data", userId, role],
      queryFn: async () => {
        const response = await http.get<RoleDataResponse>(
          "/get-user-role-by-id",
          {
            params: { user_id: userId, role },
          },
        );
        if (!response.data.exists || !response.data.user) {
          throw new Error("No role data found");
        }
        return response.data.user;
      },
      enabled: !!userId && !!role,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };

  const refreshUserData = useMutation({
    mutationFn: async (userId: string) => {
      const roleResponse = await authService.checkRole(userId);
      if (!roleResponse.success || !roleResponse.role) {
        throw new Error("No role found for user");
      }

      const { role } = roleResponse;

      if (role === "EMPTY") {
        const userResponse = await http.get<UserResponse>("/get-user-by-id", {
          params: { user_id: userId },
        });

        if (!userResponse.data.exists || !userResponse.data.user) {
          throw new Error("Failed to fetch user data");
        }

        const userData = {
          ...userResponse.data.user,
          role: role as UserRole,
        };

        return { userData, roleData: null, role };
      }

      const [userResponse, roleDataResponse] = await Promise.allSettled([
        http.get<UserResponse>("/get-user-by-id", {
          params: { user_id: userId, role },
        }),
        http.get<RoleDataResponse>("/get-user-role-by-id", {
          params: { user_id: userId, role },
        }),
      ]);

      if (
        userResponse.status === "rejected" ||
        !userResponse.value.data.exists ||
        !userResponse.value.data.user
      ) {
        throw new Error("Failed to fetch user data");
      }

      const userData = {
        ...userResponse.value.data.user,
        role: role as UserRole,
      };

      let roleData = null;
      if (
        roleDataResponse.status === "fulfilled" &&
        roleDataResponse.value.data.exists &&
        roleDataResponse.value.data.user
      ) {
        roleData = roleDataResponse.value.data.user;
      }

      return { userData, roleData, role };
    },
    onSuccess: (data, userId) => {
      queryClient.setQueryData(["user-role", userId], data.role);
      queryClient.setQueryData(["user-data", userId, data.role], data.userData);

      if (data.roleData) {
        queryClient.setQueryData(
          ["role-data", userId, data.role],
          data.roleData,
        );
      }

      queryClient.invalidateQueries({ queryKey: ["user-role", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-data", userId] });
      queryClient.invalidateQueries({ queryKey: ["role-data", userId] });
    },
    onError: (error: Error) => {
      console.error("Error refreshing user data:", error);
    },
  });

  const clearAuthCache = useMutation({
    mutationFn: async () => {
      queryClient.removeQueries({ queryKey: ["user-role"] });
      queryClient.removeQueries({ queryKey: ["user-data"] });
      queryClient.removeQueries({ queryKey: ["role-data"] });
    },
    onSuccess: () => {},
    onError: () => {},
  });

  const useCompleteUserData = (userId: string) => {
    const roleQuery = useUserRole(userId);
    const userDataQuery = useUserData(userId, roleQuery.data || "");

    const roleDataQuery = useRoleData(userId, roleQuery.data || "");

    return {
      user: userDataQuery.data,
      grantee:
        roleQuery.data === "GRANTEE" ? (roleDataQuery.data as Grantee) : null,
      payoutProvider:
        roleQuery.data === "PAYOUT_PROVIDER"
          ? (roleDataQuery.data as PayoutProvider)
          : null,
      isLoading:
        roleQuery.isLoading ||
        userDataQuery.isLoading ||
        (roleQuery.data !== "EMPTY" && roleDataQuery.isLoading),
      isError:
        roleQuery.isError ||
        userDataQuery.isError ||
        (roleQuery.data !== "EMPTY" && roleDataQuery.isError),
      error:
        roleQuery.error ||
        userDataQuery.error ||
        (roleQuery.data !== "EMPTY" ? roleDataQuery.error : null),
    };
  };

  const handleRefreshUser = async (userId: string) => {
    if (!userId) {
      throw new Error("No user ID provided");
    }
    await refreshUserData.mutateAsync(userId);
  };

  const handleClearCache = async () => {
    await clearAuthCache.mutateAsync();
  };

  return {
    useUserRole,
    useUserData,
    useRoleData,
    useCompleteUserData,

    refreshUserData,
    clearAuthCache,

    handleRefreshUser,
    handleClearCache,

    isRefreshing: refreshUserData.isPending,
    isClearingCache: clearAuthCache.isPending,
  };
};
