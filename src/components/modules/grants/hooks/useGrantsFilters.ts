import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GrantsFilters, GrantsPagination } from "../@types/filters.entity";

const DEFAULT_FILTERS: GrantsFilters = {
  search: "",
  status: "all",
  currency: "all",
  minFunding: "",
  maxFunding: "",
  startDate: "",
  endDate: "",
};

export const useGrantsFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFiltersFromUrl = (): GrantsFilters => {
    return {
      search: searchParams.get("search") || DEFAULT_FILTERS.search,
      status: searchParams.get("status") || DEFAULT_FILTERS.status,
      currency: searchParams.get("currency") || DEFAULT_FILTERS.currency,
      minFunding: searchParams.get("minFunding") || DEFAULT_FILTERS.minFunding,
      maxFunding: searchParams.get("maxFunding") || DEFAULT_FILTERS.maxFunding,
      startDate: searchParams.get("startDate") || DEFAULT_FILTERS.startDate,
      endDate: searchParams.get("endDate") || DEFAULT_FILTERS.endDate,
    };
  };

  const getPaginationFromUrl = (): GrantsPagination => {
    return {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
    };
  };

  const [filters, setFilters] = useState<GrantsFilters>(getFiltersFromUrl());
  const [pagination, setPagination] = useState<GrantsPagination>(
    getPaginationFromUrl(),
  );

  const updateUrl = (
    newFilters: GrantsFilters,
    newPagination: GrantsPagination,
  ) => {
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
  };

  const handleFilterChange = (newFilters: GrantsFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateUrl(newFilters, { ...pagination, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    updateUrl(filters, { ...pagination, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize }));
    updateUrl(filters, { ...pagination, pageSize });
  };

  useEffect(() => {
    setFilters(getFiltersFromUrl());
    setPagination(getPaginationFromUrl());
  }, [searchParams]);

  return {
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  };
};
