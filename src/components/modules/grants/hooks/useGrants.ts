import { useQuery } from "@tanstack/react-query";
import { grantsService } from "../services/grants.service";
import { GrantsFilters, GrantsPagination } from "../@types/filters.entity";

interface UseGrantsOptions {
  filters?: GrantsFilters;
  pagination?: GrantsPagination;
}

export const useGrants = (options?: UseGrantsOptions) => {
  return useQuery({
    queryKey: ["grants", options?.filters, options?.pagination],
    queryFn: () => grantsService.findAll(options?.filters, options?.pagination),
  });
};
