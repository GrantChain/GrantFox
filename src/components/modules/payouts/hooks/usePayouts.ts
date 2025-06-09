import type { Pagination } from "@/@types/pagination.entity";
import { useQuery } from "@tanstack/react-query";
import type { PayoutFilters } from "../@types/filters.entity";
import { payoutsService } from "../services/payouts.service";

interface UsePayoutsOptions {
  filters?: PayoutFilters;
  pagination?: Pagination;
}

export const usePayouts = (options?: UsePayoutsOptions) => {
  return useQuery({
    queryKey: ["payouts", options?.filters, options?.pagination],
    queryFn: () =>
      payoutsService.findAll(options?.filters, options?.pagination),
  });
};
