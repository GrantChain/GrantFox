import { authService } from "@/components/modules/auth/services/auth.service";
import type { UserRole } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";

interface UseUsersByRoleOptions {
  user_ids: string[];
  role: UserRole;
  enabled?: boolean;
}

export const useUsersByRole = ({
  user_ids,
  role,
  enabled = true,
}: UseUsersByRoleOptions) => {
  return useQuery({
    queryKey: ["users-by-role", role, user_ids],
    queryFn: async () => {
      const result = await authService.getUsersByRole(user_ids, role);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch users by role");
      }
      return result.users || [];
    },
    enabled: enabled && user_ids.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
