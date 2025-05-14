import { HelpCircle, Home, Sparkles } from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["grant_provider", "grantee"],
  },
  {
    title: "Grant Projects",
    url: "/grants/projects",
    icon: Sparkles,
    roles: ["grant_provider"],
  },
  {
    title: "Opportunities",
    url: "/grants/opportunities",
    icon: Sparkles,
    roles: ["grantee"],
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
    roles: ["grant_provider", "grantee"],
  },
];
