import type { BadgeProps } from "@/components/ui/badge";
import type { PayoutStatus } from "@/generated/prisma";

export const statusColors: Record<PayoutStatus, BadgeProps["variant"]> = {
  DRAFT: "outline",
  PUBLISHED: "success",
  CLOSED: "secondary",
  CANCELED: "destructive",
};
