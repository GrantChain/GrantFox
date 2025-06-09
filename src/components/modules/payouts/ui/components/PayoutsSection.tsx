"use client";

import { ErrorFetching } from "@/components/shared/ErrorFetching";
import { NoData } from "../../../../shared/NoData";
import { usePayouts } from "../../hooks/usePayouts";
import { usePayoutsFilters } from "../../hooks/usePayoutsFilters";
import { PayoutCard } from "./PayoutCard";
import { PayoutCardSkeleton } from "./PayoutCardSkeleton";
import { PayoutsFilters } from "./PayoutFilters";
import { PayoutPagination } from "./PayoutPagination";

export const PayoutsSection = () => {
  const {
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = usePayoutsFilters();

  const { data, isLoading, error } = usePayouts({
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
    <div className="space-y-6 max-w-[90rem] mx-auto">
      <PayoutsFilters onFilterChange={handleFilterChange} filters={filters} />

      <div
        className={`grid mt-10 ${
          data?.data.length === 0
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        } gap-10`}
      >
        {isLoading ? (
          Array.from({ length: pagination.pageSize }).map((_, index) => (
            <PayoutCardSkeleton key={`skeleton-${index}-${pagination.page}`} />
          ))
        ) : data?.data.length === 0 ? (
          <NoData />
        ) : (
          data?.data.map((payout) => (
            <PayoutCard key={payout.payout_id} payout={payout} />
          ))
        )}
      </div>

      {data && (
        <PayoutPagination
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
