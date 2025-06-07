'use client';

import { supabase } from '@/lib/supabase';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';

type Role = 'ADMIN' | 'GRANTEE' | 'GRANT_PROVIDER';

interface WithRoleAccessProps {
  allowedRoles: Role[];
}

export function withRoleAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { allowedRoles }: WithRoleAccessProps,
) {
  return function WithRoleAccessComponent(props: P) {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    const checkAccess = useCallback(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session || !user) {
          toast.error('Please log in to access this page');
          router.push(`/login?redirectTo=${pathname}`);
          return;
        }

        if (!isLoading && user) {
          const userRole = user.role as Role;
          if (!allowedRoles.includes(userRole)) {
            toast.error("You don't have permission to access this page");
            router.push('/unauthorized');
          }
        }
      } catch (error) {
        console.error('Error checking access:', error);
        toast.error('An error occurred while checking access');
        router.push('/login');
      } finally {
        setIsChecking(false);
      }
    }, [user, isLoading, router, pathname, allowedRoles]);

    useEffect(() => {
      checkAccess();
    }, [checkAccess]);

    // Show loading state while checking access
    if (isLoading || isChecking) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    if (!user || !allowedRoles.includes(user.role as Role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
