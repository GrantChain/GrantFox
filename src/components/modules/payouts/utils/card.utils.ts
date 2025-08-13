import type { BadgeProps } from "@/components/ui/badge";
import type { PayoutStatus } from "@/generated/prisma";

export const statusColors: Record<PayoutStatus, BadgeProps["variant"]> = {
  DRAFT: "default",
  PUBLISHED: "success",
  CLOSED: "destructive",
  CANCELED: "destructive",
};
