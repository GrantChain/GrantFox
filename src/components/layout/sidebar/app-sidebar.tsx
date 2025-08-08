"use client";

import { useAuth } from "@/components/modules/auth/context/AuthContext";
import TooltipInfo from "@/components/shared/TooltipInfo";
import { Separator } from "@/components/ui/separator";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useWallet } from "@/components/wallet/hooks/useWallet";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { useMemo } from "react";
import { navItems } from "./constants/items.constant";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { account } = useWallet();
  const isConnected = Boolean(account);
  const { open } = useSidebar();
  const { user, isLoading } = useAuth();

  const platformItems = navItems.filter((item) => item.group === "Platform");
  const payoutItems = navItems.filter((item) => item.group === "Payouts");

  const filteredPayoutItems = useMemo(() => {
    if (user?.role) {
      return payoutItems.filter((item) => item.roles.includes(user.role));
    }
    if (!isLoading && user) {
      return payoutItems.filter(
        (item) =>
          item.roles.includes("PAYOUT_PROVIDER") ||
          item.roles.includes("GRANTEE"),
      );
    }
    return [];
  }, [user?.role, isLoading, user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="GrantFox Logo"
              width={32}
              height={32}
              className="rounded-md group-data-[collapsible=icon]:justify-center"
            />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              GrantFox
            </span>
          </div>
          <SidebarTrigger className="self-end group-data-[collapsible=icon]:hidden h-10 w-10 z-0" />
        </div>
        <SidebarTrigger className="hidden group-data-[collapsible=icon]:flex h-10  mx-auto mt-2" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {platformItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <TooltipInfo
                  content={
                    !isConnected
                      ? "Connect your wallet to access this section"
                      : ""
                  }
                >
                  <div className="w-full">
                    <SidebarMenuButton asChild disabled={!isConnected}>
                      <Link
                        href={isConnected ? item.url : "#"}
                        className={`flex items-center gap-2 ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={(e) => !isConnected && e.preventDefault()}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </div>
                </TooltipInfo>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Payouts</SidebarGroupLabel>
          <SidebarMenu>
            {filteredPayoutItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <TooltipInfo
                  content={
                    !isConnected
                      ? "Connect your wallet to access this section"
                      : ""
                  }
                >
                  <div className="w-full">
                    <SidebarMenuButton asChild disabled={!isConnected}>
                      <Link
                        href={isConnected ? item.url : "#"}
                        className={`flex items-center gap-2 ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={(e) => !isConnected && e.preventDefault()}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </div>
                </TooltipInfo>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 px-4 py-2 group-data-[collapsible=icon]:px-0">
          {!isConnected &&
            (open ? (
              <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-200 rounded-md p-2 text-xs whitespace-nowrap">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>Connect wallet to continue</span>
              </div>
            ) : (
              <div className="flex items-center justify-center p-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-200 rounded-md text-xs">
                <TooltipInfo content="Connect wallet to continue">
                  <AlertTriangle className="h-4 w-4" />
                </TooltipInfo>
              </div>
            ))}

          <Separator className="my-1" />
          <NavUser
            user={{
              name: user?.username || "User",
              email: user?.email || "",
              avatar: user?.profile_url || "",
              role: user?.role || "",
            }}
          />
        </div>
        <SidebarRail />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
