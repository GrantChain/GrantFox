import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";

interface RoleSelectionHookProps {
  onClose: () => void;
}

export const useRoleSelection = ({ onClose }: RoleSelectionHookProps) => {
  const [selectedRole, setSelectedRole] = useState<
    "PAYOUT_PROVIDER" | "GRANTEE" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refreshUser, user } = useAuth();

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const result = await authService.registerRole(user.user_id, selectedRole);

      if (result.success) {
        toast.success("Role registered successfully");
        await refreshUser();
        router.refresh();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error registering role:", error);
      toast.error("Failed to register role");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedRole,
    setSelectedRole,
    isLoading,
    handleSubmit,
  };
};
