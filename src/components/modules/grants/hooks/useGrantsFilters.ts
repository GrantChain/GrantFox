import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GrantsFilters } from "../@types/filters.entity";
import { Pagination } from "@/@types/pagination.entity";

const DEFAULT_FILTERS: GrantsFilters = {
  search: "",
  minFunding: "",
  maxFunding: "",
  startDate: "",
  endDate: "",
};

export const useGrantsFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFiltersFromUrl = useCallback((): GrantsFilters => {
    return {
      search: searchParams.get("search") || DEFAULT_FILTERS.search,
      minFunding: searchParams.get("minFunding") || DEFAULT_FILTERS.minFunding,
      maxFunding: searchParams.get("maxFunding") || DEFAULT_FILTERS.maxFunding,
      startDate: searchParams.get("startDate") || DEFAULT_FILTERS.startDate,
      endDate: searchParams.get("endDate") || DEFAULT_FILTERS.endDate,
    };
  }, [searchParams]);

  const getPaginationFromUrl = useCallback((): Pagination => {
    return {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<GrantsFilters>(getFiltersFromUrl());
  const [pagination, setPagination] = useState<Pagination>(
    getPaginationFromUrl(),
  );

  const updateUrl = useCallback(
    (newFilters: GrantsFilters, newPagination: Pagination) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== DEFAULT_FILTERS[key as keyof GrantsFilters]) {
          params.set(key, value);
        }
      });

      Object.entries(newPagination).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
      });

      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const handleFilterChange = useCallback(
    (newFilters: GrantsFilters) => {
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
  }, [searchParams, getFiltersFromUrl, getPaginationFromUrl]);

  return {
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  };
};
