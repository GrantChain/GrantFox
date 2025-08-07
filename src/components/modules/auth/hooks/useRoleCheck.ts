import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { supabase } from "@/lib/supabase";

export function useRoleCheck() {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: isAuthLoading } = useAuth();

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

        const response = await authService.checkRole(user.user_id);

        if (response.success && response.role === "EMPTY") {
          setShouldShowModal(true);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsLoading(false);
      }
    }

    checkUserRole();
  }, [isAuthLoading, user?.user_id]);

  return { shouldShowModal, isLoading, setShouldShowModal };
}
