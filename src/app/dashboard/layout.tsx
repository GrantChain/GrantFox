"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import useLayoutDashboard from "@/hooks/layout-dashboard.hook";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { label } = useLayoutDashboard();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="bg-muted/50 min-h-screen">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-full">
            <h2 className="text-3xl font-bold tracking-tight">{label}</h2>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
