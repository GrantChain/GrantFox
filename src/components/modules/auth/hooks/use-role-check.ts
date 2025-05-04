import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

        const response = await fetch(`/api/check-role/${user.id}`);

        if (response.ok) {
          const { role } = await response.json();

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
