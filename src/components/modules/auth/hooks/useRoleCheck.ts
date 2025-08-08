import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthMutations } from "./useAuthMutations";

export function useRoleCheck() {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: isAuthLoading } = useAuth();
  const { useUserRole } = useAuthMutations();
  const roleQuery = useUserRole(user?.user_id || "");

  useEffect(() => {
    async function checkUserRole() {
      try {
        if (isAuthLoading) return;

        if (!user) {
          setIsLoading(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const provider = session?.user?.app_metadata?.provider as
          | "google"
          | "github"
          | string
          | undefined;
        const isOAuthUser = provider === "google" || provider === "github";

        if (isOAuthUser) {
          try {
            const { authService } = await import("../services/auth.service");
            const response = await authService.verifyAndCreateOAuthUser(
              user.user_id,
              user.email || "",
            );

            if (!response.success) {
              console.error(
                "Failed to verify/create OAuth user in role check:",
                response.message,
              );
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error(
              "Error checking/creating OAuth user in role check:",
              error,
            );
            setIsLoading(false);
            return;
          }
        }

        // rely on shared role query to avoid duplicate /check-role
        if (!roleQuery.isLoading) {
          if (roleQuery.data === "EMPTY") {
            setShouldShowModal(true);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsLoading(false);
      }
    }

    void checkUserRole();
  }, [isAuthLoading, user?.user_id, roleQuery.isLoading, roleQuery.data]);

  return { shouldShowModal, isLoading, setShouldShowModal };
}
