"use client";

import { useAuth } from "@/components/modules/auth/context/AuthContext";
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
  const { user } = useAuth();

  const { data, isLoading, error } = usePayouts(
    user?.user_id
      ? {
          filters,
          pagination,
          role: user.role,
          userId: user.user_id,
        }
      : undefined,
  );

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <ErrorFetching />
      </div>
    );
  }

  return (
    <section className="flex flex-col h-full">
      <PayoutsFilters onFilterChange={handleFilterChange} filters={filters} />

      <div className="flex-1">
        {isLoading && !data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <PayoutCardSkeleton
                key={`skeleton-${index}-${pagination.page}`}
              />
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <div className="mt-10">
            <NoData />
          </div>
        ) : data?.data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {data.data.map((payout) => (
              <PayoutCard key={payout.payout_id} payout={payout} />
            ))}
          </div>
        ) : null}
      </div>

      {data && (
        <div className="my-10 border-t pt-6">
          <PayoutPagination
            currentPage={pagination.page}
            totalItems={data.total}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </section>
  );
};
