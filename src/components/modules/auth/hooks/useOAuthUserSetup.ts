import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { authService } from "../services/auth.service";

export const useOAuthUserSetup = () => {
  useEffect(() => {
    const handleAuthStateChange = async (
      event: string,
      session: Session | null,
    ) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;

        // Solo procesar si es un usuario de OAuth (no tiene password)
        if (
          user.app_metadata?.provider === "google" ||
          user.app_metadata?.provider === "github"
        ) {
          try {
            // Verificar y crear el usuario OAuth en la BD
            const response = await authService.verifyAndCreateOAuthUser(
              user.id,
              user.email || "",
            );

            if (!response.success) {
              console.error(
                "Failed to verify/create OAuth user:",
                response.message,
              );
            } else {
              console.log("OAuth user verified/created successfully");
            }
          } catch (error) {
            console.error("Error setting up OAuth user:", error);
          }
        }
      }
    };

    // Suscribirse a cambios de estado de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Verificar sesión actual al montar sin llamar a getUser (evita red extra)
    const checkCurrentSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return;

      const currentUser = data.session.user;
      if (
        currentUser &&
        (currentUser.app_metadata?.provider === "google" ||
          currentUser.app_metadata?.provider === "github")
      ) {
        try {
          const response = await authService.verifyAndCreateOAuthUser(
            currentUser.id,
            currentUser.email || "",
          );

          if (!response.success) {
            console.error(
              "Failed to verify/create current OAuth user:",
              response.message,
            );
          } else {
            console.log("Current OAuth user verified/created successfully");
          }
        } catch (err) {
          console.error("Error setting up current OAuth user:", err);
        }
      }
    };

    checkCurrentSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
};
