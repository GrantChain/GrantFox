import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { checkRole } from "../services/check-role.service";

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

        const response = await checkRole(user.id);

        if (response.success) {
          const { role } = response.data as { role: string };

          if (!role || role === "") {
            setShouldShowModal(true);
          }
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
