"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { MobileTrigger } from "@/components/layout/sidebar/mobile-trigger";
import { RoleSelectionProvider } from "@/components/providers/role-selection.provider";
import { UserProvider } from "@/components/modules/auth/context/UserContext";
import { Footer } from "@/components/layout/footer/Footer";
import { Header } from "@/components/layout/header/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
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

export default Layout;
