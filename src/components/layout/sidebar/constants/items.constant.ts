import { Home, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: string[];
  group?: string;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["PAYOUT_PROVIDER", "GRANTEE"],
    group: "Platform",
  },
  // {
  //   title: "Support",
  //   url: "/dashboard/support",
  //   icon: LifeBuoy,
  //   roles: ["SUPPORT", "PAYOUT_PROVIDER", "GRANTEE"],
  //   group: "Platform",
  // },
  {
    title: "Payouts",
    url: "/dashboard/payout-provider/payouts",
    icon: Sparkles,
    roles: ["PAYOUT_PROVIDER"],
    group: "Payouts",
  },
  {
    title: "Assigned Payouts",
    url: "/dashboard/grantee/payouts",
    icon: Sparkles,
    roles: ["GRANTEE"],
    group: "Payouts",
  },
];
