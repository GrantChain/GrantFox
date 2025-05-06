"use client";

import type * as React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  // biome-ignore lint/suspicious/noShadowRestrictedNames: <Map is a valid name but you need to be careful with it, as is also reserved in JS>
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  AlertTriangle,
  Wallet as WalletIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { ThemeToggle } from "@/components/layout/sidebar/theme-toggler";
import { Separator } from "@/components/ui/separator";

import { useWallet } from "@/components/wallet/hooks/wallet.hook";            
import { Button } from "@/components/ui/button";          

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { handleConnect, handleDisconnect, account } = useWallet();
    const isConnected = Boolean(account);

    const { open } = useSidebar();
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
      {!isConnected && (
         open ? (
           <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-md p-2 mb-2 text-sm">
             Connect your wallet to enable on-chain actions
           </div>
         ) : (
           <div className="flex items-center justify-center p-2 mb-2">
             <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
           </div>
         )
       )}

        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
         <div className="flex flex-col gap-2 px-4 py-2">
            <Button
           variant="outline"
           size="default"
           onClick={isConnected ? handleDisconnect : handleConnect}
         >
           {open
             ? (isConnected ? "Disconnect Wallet" : "Connect Wallet")
             : <WalletIcon className="h-5 w-5" />
           }
         </Button>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Theme</p>
              <ThemeToggle />
            </div>
            <Separator className="my-1" />
            <NavUser user={data.user} />
          </div>
          <SidebarRail />
        </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
