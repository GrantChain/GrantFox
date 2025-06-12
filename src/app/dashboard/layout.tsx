"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { RoleSelectionProvider } from "@/components/providers/role-selection.provider";
import { AuthProvider } from "@/components/modules/auth/context/AuthContext";
import { Footer } from "@/components/layout/footer/Footer";
import { Header } from "@/components/layout/header/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <RoleSelectionProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="min-h-screen flex flex-col">
              <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-full">
                {children}
              </div>
            </div>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </RoleSelectionProvider>
    </AuthProvider>
  );
};

export default Layout;
