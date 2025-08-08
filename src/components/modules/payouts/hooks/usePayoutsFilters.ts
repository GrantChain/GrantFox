import type { Pagination } from "@/@types/pagination.entity";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { PayoutFilters } from "../@types/filters.entity";

export const DEFAULT_FILTERS: PayoutFilters = {
  search: "",
  minFunding: "",
  maxFunding: "",
  startDate: "",
  endDate: "",
  payoutProviderName: "",
  granteeName: "",
};

export const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  pageSize: 10,
};

export const usePayoutsFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFiltersFromUrl = useCallback((): PayoutFilters => {
    return {
      search: searchParams.get("search") || DEFAULT_FILTERS.search,
      minFunding: searchParams.get("minFunding") || DEFAULT_FILTERS.minFunding,
      maxFunding: searchParams.get("maxFunding") || DEFAULT_FILTERS.maxFunding,
      startDate: searchParams.get("startDate") || DEFAULT_FILTERS.startDate,
      endDate: searchParams.get("endDate") || DEFAULT_FILTERS.endDate,
      payoutProviderName:
        searchParams.get("payoutProviderName") ||
        DEFAULT_FILTERS.payoutProviderName,
      granteeName:
        searchParams.get("granteeName") || DEFAULT_FILTERS.granteeName,
    };
  }, [searchParams]);

  const getPaginationFromUrl = useCallback((): Pagination => {
    return {
      page: Number(searchParams.get("page")) || DEFAULT_PAGINATION.page,
      pageSize:
        Number(searchParams.get("pageSize")) || DEFAULT_PAGINATION.pageSize,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<PayoutFilters>(getFiltersFromUrl());
  const [pagination, setPagination] = useState<Pagination>(
    getPaginationFromUrl(),
  );

  const updateUrl = useCallback(
    (newFilters: PayoutFilters, newPagination: Pagination) => {
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(newFilters)) {
        if (value && value !== DEFAULT_FILTERS[key as keyof PayoutFilters]) {
          params.set(key, value);
        }
      }

      for (const [key, value] of Object.entries(newPagination)) {
        if (value) params.set(key, value.toString());
      }

      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const handleFilterChange = useCallback(
    (newFilters: PayoutFilters) => {
      setFilters(newFilters);
      setPagination((prev) => ({ ...prev, page: 1 }));
      updateUrl(newFilters, { ...pagination, page: 1 });
    },
    [pagination, updateUrl],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      updateUrl(filters, { ...pagination, page });
    },
    [filters, pagination, updateUrl],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setPagination((prev) => ({ ...prev, pageSize }));
      updateUrl(filters, { ...pagination, pageSize });
    },
    [filters, pagination, updateUrl],
  );

  useEffect(() => {
    setFilters(getFiltersFromUrl());
    setPagination(getPaginationFromUrl());
  }, [getFiltersFromUrl, getPaginationFromUrl]);

  return {
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  };
};
