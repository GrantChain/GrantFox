import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { authService } from "../services/auth.service";

export function useRoleCheck() {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        // Verificar si es un usuario OAuth
        const isOAuthUser = user.app_metadata?.provider === "google" || user.app_metadata?.provider === "github";

        // Si es OAuth, verificar y crear si no existe
        if (isOAuthUser) {
          try {
            const response = await authService.verifyAndCreateOAuthUser(
              user.id,
              user.email || "",
            );

            if (!response.success) {
              console.error("Failed to verify/create OAuth user in role check:", response.message);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error checking/creating OAuth user in role check:", error);
            setIsLoading(false);
            return;
          }
        }

        // Verificar el role del usuario
        const response = await authService.checkRole(user.id);

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
  }, []);

  return { shouldShowModal, isLoading, setShouldShowModal };
}
