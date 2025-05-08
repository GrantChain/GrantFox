"use client";

import type * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertTriangle,
  Wallet as WalletIcon,
  Home,
  Sparkles,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { ThemeToggle } from "@/components/layout/sidebar/theme-toggler";
import { Separator } from "@/components/ui/separator";

import { useWallet } from "@/components/wallet/hooks/wallet.hook";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

// This is sample data.
const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["grantProvider", "grantee"],
  },
  {
    title: "Grant Projects",
    url: "/projects",
    icon: Sparkles,
    roles: ["grantProvider", "grantee"],
  },
  {
    title: "Opportunities",
    url: "/opportunities",
    icon: Sparkles,
    roles: ["grantee"],
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
    roles: ["grantProvider", "grantee"],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { handleConnect, handleDisconnect, account } = useWallet();
  const isConnected = Boolean(account);

  const { open } = useSidebar();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("Error fetching session:");
        return;
      }
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("user")
          .select("email, pfp_url, role")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        if (profile) {
          setUserData({
            name: user.email?.split("@")[0] || "User",
            email: user.email || "",
            avatar: profile.pfp_url || "",
            role: profile.role || "grantee", // Default to grantee if no role is set
          });
        }
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userData.role),
  );

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
        {!isConnected &&
          (open ? (
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-md p-2 mb-2 text-sm">
              Connect your wallet to enable on-chain actions
            </div>
          ) : (
            <div className="flex items-center justify-center p-2 mb-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
            </div>
          ))}
        <SidebarMenu className="px-2 py-2">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton className="w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </>
          ) : (
            filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 px-4 py-2 group-data-[collapsible=icon]:px-0">
          <Button
            variant="outline"
            size="default"
            onClick={isConnected ? handleDisconnect : handleConnect}
          >
            {open ? (
              isConnected ? (
                "Disconnect Wallet"
              ) : (
                "Connect Wallet"
              )
            ) : (
              <WalletIcon className="h-5 w-5" />
            )}
          </Button>
          <div className="flex items-center justify-between px-4 py-2 group-data-[collapsible=icon]:px-2">
            <p className="text-sm font-medium group-data-[collapsible=icon]:hidden">
              Theme
            </p>
            <ThemeToggle />
          </div>
          <Separator className="my-1" />
          <NavUser user={userData} />
        </div>
        <SidebarRail />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
