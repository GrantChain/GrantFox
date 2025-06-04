import { HelpCircle, History, Home, Sparkles, UserCircle } from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["PAYOUT_PROVIDER", "GRANTEE"],
  },
  {
    title: "Payouts",
    url: "/dashboard/payout-provider/payouts",
    icon: Sparkles,
    roles: ["PAYOUT_PROVIDER"],
  },
  {
    title: "Assigned Payouts",
    url: "/dashboard/grantee/payouts",
    icon: Sparkles,
    roles: ["GRANTEE"],
  },
  {
    title: "Historic",
    url: "/history",
    icon: History,
    roles: ["PAYOUT_PROVIDER", "GRANTEE"],
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: UserCircle,
    roles: ["GRANT_PROVIDER", "GRANTEE"],
  },
  {
    title: "Help",
    url: "/dashboard/help",
    icon: HelpCircle,
    roles: ["PAYOUT_PROVIDER", "GRANTEE"],
  },
];
