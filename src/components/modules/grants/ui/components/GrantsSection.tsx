"use client";

import { useGrants } from "../../hooks/useGrants";
import { GrantFilters } from "./GrantFilters";
import { GrantPagination } from "./GrantPagination";
import { GrantCard } from "./GrantCard";
import { GrantCardSkeleton } from "./GrantCardSkeleton";
import { NoData } from "../../../../shared/NoData";
import { ErrorFetching } from "@/components/shared/ErrorFetching";
import { useGrantsFilters } from "../../hooks/useGrantsFilters";

export const GrantsSection = () => {
  const {
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useGrantsFilters();

  const { data, isLoading, error } = useGrants({
    filters,
    pagination,
  });

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <ErrorFetching />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GrantFilters onFilterChange={handleFilterChange} filters={filters} />

      <div
        className={`grid ${
          data?.data.length === 0
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        } gap-4`}
      >
        {isLoading ? (
          Array.from({ length: pagination.pageSize }).map((_, index) => (
            <GrantCardSkeleton key={index} />
          ))
        ) : data?.data.length === 0 ? (
          <NoData />
        ) : (
          data?.data.map((grant) => (
            <GrantCard key={grant.grant_id} grant={grant} />
          ))
        )}
      </div>

      {data && (
        <GrantPagination
          currentPage={pagination.page}
          totalItems={data.total}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};
