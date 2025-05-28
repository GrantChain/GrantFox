import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { registerRole } from "../services/register-role.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

interface RoleSelectionHookProps {
  onClose: () => void;
}

export const useRoleSelection = ({ onClose }: RoleSelectionHookProps) => {
  const [selectedRole, setSelectedRole] = useState<
    "GRANT_PROVIDER" | "GRANTEE" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useUser();

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const result = await registerRole(user.id, selectedRole);

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
