'use client';

import { Footer } from '@/components/layout/footer/Footer';
import { Header } from '@/components/layout/header/Header';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { UserProvider } from '@/components/modules/auth/context/UserContext';
import { withRoleAccess } from '@/components/modules/auth/hoc/withRoleAccess';
import { RoleSelectionProvider } from '@/components/providers/role-selection.provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <UserProvider>
      <RoleSelectionProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="min-h-screen">
              <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-full">
                {children}
              </div>
            </div>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </RoleSelectionProvider>
    </UserProvider>
  );
};

// Protect the entire dashboard with role-based access
export default withRoleAccess(DashboardLayout, {
  allowedRoles: ['ADMIN', 'GRANTEE', 'GRANT_PROVIDER'],
});
