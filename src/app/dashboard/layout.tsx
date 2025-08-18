"use client";

import { Footer } from "@/components/layout/footer/Footer";
import { Header } from "@/components/layout/header/Header";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { AuthProvider } from "@/components/modules/auth/context/AuthContext";
import { usePrefetchData } from "@/components/modules/auth/hooks/usePrefetchData";
import { PayoutContextProvider } from "@/components/modules/payouts/context/PayoutContext";
import { PayoutLoadersProvider } from "@/components/modules/payouts/context/PayoutLoadersContext";
import { RoleSelectionProvider } from "@/components/providers/role-selection.provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useGlobalWalletStore } from "@/components/wallet/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  usePrefetchData();
  const router = useRouter();
  const pathname = usePathname();
  const { address } = useGlobalWalletStore();

  useEffect(() => {
    if (!address) {
      const isPublicProfile = pathname?.startsWith("/dashboard/public-profile");
      const isProfile = pathname === "/dashboard/profile";
      if (!isProfile && !isPublicProfile) {
        router.push("/dashboard");
      }
    }
  }, [address, pathname]);

  return (
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
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <PayoutContextProvider>
        <PayoutLoadersProvider>
          <RoleSelectionProvider>
            <DashboardContent>{children}</DashboardContent>
          </RoleSelectionProvider>
        </PayoutLoadersProvider>
      </PayoutContextProvider>
    </AuthProvider>
  );
};

export default Layout;
