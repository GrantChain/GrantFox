import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const MobileTrigger = () => {
  const { isMobile } = useSidebar();

  return isMobile && <SidebarTrigger className={cn("h-10 w-10 z-0")} />;
};
