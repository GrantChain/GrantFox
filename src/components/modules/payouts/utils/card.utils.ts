import type { PayoutStatus } from "@/generated/prisma";
import type { BadgeProps } from "@/components/ui/badge";

export const statusColors: Record<PayoutStatus, BadgeProps["variant"]> = {
  DRAFT: "outline",
  PUBLISHED: "success",
  CLOSED: "secondary",
  CANCELED: "destructive",
};
