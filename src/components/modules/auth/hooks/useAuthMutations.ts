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

  // Query para obtener el rol del usuario
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
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    });
  };

  // Query para obtener datos del usuario
  const useUserData = (userId: string, role: string) => {
    return useQuery({
      queryKey: ["user-data", userId, role],
      queryFn: async () => {
        // Si el role es EMPTY, no incluir el parámetro role en la query
        const params = role === "EMPTY" 
          ? { user_id: userId }
          : { user_id: userId, role };
          
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
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    });
  };

  // Query para obtener datos específicos del rol
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
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    });
  };

  // Mutation para refrescar datos del usuario
  const refreshUserData = useMutation({
    mutationFn: async (userId: string) => {
      // Obtener rol
      const roleResponse = await authService.checkRole(userId);
      if (!roleResponse.success || !roleResponse.role) {
        throw new Error("No role found for user");
      }

      const { role } = roleResponse;

      // Si el role es EMPTY, solo obtener datos del usuario, no datos específicos del role
      if (role === "EMPTY") {
        const userResponse = await http.get<UserResponse>("/get-user-by-id", {
          params: { user_id: userId },
        });

        if (
          !userResponse.data.exists ||
          !userResponse.data.user
        ) {
          throw new Error("Failed to fetch user data");
        }

        const userData = {
          ...userResponse.data.user,
          role: role as UserRole,
        };

        return { userData, roleData: null, role };
      }

      // Para otros roles, obtener datos en paralelo
      const [userResponse, roleDataResponse] = await Promise.allSettled([
        http.get<UserResponse>("/get-user-by-id", {
          params: { user_id: userId, role },
        }),
        http.get<RoleDataResponse>("/get-user-role-by-id", {
          params: { user_id: userId, role },
        }),
      ]);

      // Procesar respuesta del usuario
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

      // Procesar respuesta de role data
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
      // Actualizar cache con los nuevos datos
      queryClient.setQueryData(["user-role", userId], data.role);
      queryClient.setQueryData(["user-data", userId, data.role], data.userData);

      if (data.roleData) {
        queryClient.setQueryData(
          ["role-data", userId, data.role],
          data.roleData,
        );
      }

      // Invalidar queries relacionadas para forzar re-fetch si es necesario
      queryClient.invalidateQueries({ queryKey: ["user-role", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-data", userId] });
      queryClient.invalidateQueries({ queryKey: ["role-data", userId] });
    },
    onError: (error: Error) => {
      console.error("Error refreshing user data:", error);
    },
  });

  // Mutation para limpiar cache de autenticación
  const clearAuthCache = useMutation({
    mutationFn: async () => {
      // Limpiar cache de TanStack Query
      queryClient.removeQueries({ queryKey: ["user-role"] });
      queryClient.removeQueries({ queryKey: ["user-data"] });
      queryClient.removeQueries({ queryKey: ["role-data"] });
    },
    onSuccess: () => {},
    onError: () => {},
  });

  // Función helper para obtener datos completos del usuario
  const useCompleteUserData = (userId: string) => {
    const roleQuery = useUserRole(userId);
    const userDataQuery = useUserData(userId, roleQuery.data || "");
    
    // Solo obtener datos específicos del role si no es EMPTY
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
      error: roleQuery.error || userDataQuery.error || (roleQuery.data !== "EMPTY" ? roleDataQuery.error : null),
    };
  };

  // Función helper para refrescar datos del usuario
  const handleRefreshUser = async (userId: string) => {
    if (!userId) {
      throw new Error("No user ID provided");
    }
    await refreshUserData.mutateAsync(userId);
  };

  // Función helper para limpiar cache
  const handleClearCache = async () => {
    await clearAuthCache.mutateAsync();
  };

  return {
    // Queries
    useUserRole,
    useUserData,
    useRoleData,
    useCompleteUserData,

    // Mutations
    refreshUserData,
    clearAuthCache,

    // Helper functions
    handleRefreshUser,
    handleClearCache,

    // Loading states
    isRefreshing: refreshUserData.isPending,
    isClearingCache: clearAuthCache.isPending,
  };
};