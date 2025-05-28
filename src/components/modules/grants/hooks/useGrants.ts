import { useQuery } from "@tanstack/react-query";
import { grantsService } from "../services/grants.service";
import { GrantsFilters } from "../@types/filters.entity";
import { Pagination } from "@/@types/pagination.entity";

interface UseGrantsOptions {
  filters?: GrantsFilters;
  pagination?: Pagination;
}

export const useGrants = (options?: UseGrantsOptions) => {
  return useQuery({
    queryKey: ["grants", options?.filters, options?.pagination],
    queryFn: () => grantsService.findAll(options?.filters, options?.pagination),
  });
};
