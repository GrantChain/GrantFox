import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useRoleCheck() {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Endpoint to check the role from the DB
        const response = await fetch(`/api/check-role/${user.id}`);
        
        if (response.ok) {
          const { role } = await response.json();
          
          // If the role is empty or does not exist, show modal
          if (!role || role === "") {
            setShouldShowModal(true);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking user role:', error);
        setIsLoading(false);
      }
    }

    checkUserRole();
  }, [supabase]);

  return { shouldShowModal, isLoading, setShouldShowModal };
}