import type { PayoutStatus } from "@/generated/prisma";

export const statusColors: Record<PayoutStatus, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  PUBLISHED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
  CANCELED: "bg-red-100 text-red-800",
};
