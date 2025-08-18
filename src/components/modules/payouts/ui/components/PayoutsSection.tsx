"use client";

import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { ErrorFetching } from "@/components/shared/ErrorFetching";
import { useEffect, useMemo } from "react";
import { NoData } from "../../../../shared/NoData";
import { usePayout } from "../../context/PayoutContext";
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
  const { fetchEscrowBalances } = usePayout();

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

  // Batch fetch escrow balances for visible payouts (only once per page/filter change)
  const visibleEscrowIds = useMemo(() => {
    return (data?.data || [])
      .map((p) => p.escrow_id)
      .filter((id): id is string => Boolean(id));
  }, [data?.data]);

  useEffect(() => {
    const run = async () => {
      if (!visibleEscrowIds.length) return;
      await fetchEscrowBalances(visibleEscrowIds);
    };
    void run();
  }, [visibleEscrowIds.join("|")]);

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
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
