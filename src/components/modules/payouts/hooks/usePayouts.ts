import type { Pagination } from "@/@types/pagination.entity";
import type { UserRole } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import type { PayoutFilters } from "../@types/filters.entity";
import { payoutsService } from "../services/payouts.service";

interface UsePayoutsOptions {
  filters?: PayoutFilters;
  pagination?: Pagination;
  role?: UserRole;
  userId?: string;
}

export const usePayouts = (options?: UsePayoutsOptions) => {
  return useQuery({
    queryKey: [
      "payouts",
      options?.filters,
      options?.pagination,
      options?.role,
      options?.userId,
    ],
    queryFn: () =>
      payoutsService.findAll(
        options?.filters,
        options?.pagination,
        options?.role,
        options?.userId,
      ),
    enabled: !!options?.role && !!options?.userId,
  });
};
