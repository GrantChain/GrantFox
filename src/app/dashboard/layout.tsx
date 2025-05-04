"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import useLayoutDashboard from "@/hooks/layout-dashboard.hook";
import { MobileTrigger } from "@/components/layout/sidebar/mobile-trigger";
import { Footer } from "@/components/layout/footer";
import { RoleSelectionProvider } from "@/components/modules/auth/ui/role-selection-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  console.log("📍 Dashboard Layout renderizado");
  const { label } = useLayoutDashboard();

  return (
    <RoleSelectionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
              <div className="flex gap-4">
                <MobileTrigger />
                <h2 className="text-3xl font-bold tracking-tight">{label}</h2>
              </div>

              {children}
            </div>
            <Footer />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RoleSelectionProvider>
  );
};

export default Layout;
