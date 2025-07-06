import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { authService } from "../services/auth.service";
import type { Session } from "@supabase/supabase-js";

export const useOAuthUserSetup = () => {
  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: Session | null) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;
        
        // Solo procesar si es un usuario de OAuth (no tiene password)
        if (user.app_metadata?.provider === "google" || user.app_metadata?.provider === "github") {
          try {
            // Verificar y crear el usuario OAuth en la BD
            const response = await authService.verifyAndCreateOAuthUser(
              user.id,
              user.email || "",
            );

            if (!response.success) {
              console.error("Failed to verify/create OAuth user:", response.message);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Verificar usuario actual al montar el componente
    const checkCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && (user.app_metadata?.provider === "google" || user.app_metadata?.provider === "github")) {
        try {
          const response = await authService.verifyAndCreateOAuthUser(
            user.id,
            user.email || "",
          );

          if (!response.success) {
            console.error("Failed to verify/create current OAuth user:", response.message);
          } else {
            console.log("Current OAuth user verified/created successfully");
          }
        } catch (error) {
          console.error("Error setting up current OAuth user:", error);
        }
      }
    };

    checkCurrentUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}; 