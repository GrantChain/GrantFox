import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import type { PayoutFilters } from "../../@types/filters.entity";
import { usePayout } from "../../context/PayoutContext";
import {
  createEmptyFilters,
  createInitialDateRange,
  formatDateRangeToFilters,
  isThereAnyFilter,
} from "../../utils/filter.utils";
import { PayoutFormModal } from "./PayoutFormModal";

interface PayoutsFiltersProps {
  onFilterChange: (filters: PayoutFilters) => void;
  filters: PayoutFilters;
}

export const PayoutsFilters = ({
  onFilterChange,
  filters,
}: PayoutsFiltersProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    createInitialDateRange(filters),
  );
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [minFundingValue, setMinFundingValue] = useState(
    filters.minFunding ?? "",
  );
  const [maxFundingValue, setMaxFundingValue] = useState(
    filters.maxFunding ?? "",
  );
  // const [payoutProviderNameValue, setPayoutProviderNameValue] = useState(
  //   filters.payoutProviderName || "",
  // );
  // const [granteeNameValue, setGranteeNameValue] = useState(
  //   filters.granteeName || "",
  // );
  const { showCreateModal, setShowCreateModal } = usePayout();
  const { user } = useAuth();

  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      onFilterChange({ ...filters, [key]: value });
    },
    [filters, onFilterChange],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        handleFilterChange("search", searchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, handleFilterChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minFundingValue !== filters.minFunding) {
        handleFilterChange("minFunding", minFundingValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [minFundingValue, filters.minFunding, handleFilterChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (maxFundingValue !== filters.maxFunding) {
        handleFilterChange("maxFunding", maxFundingValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [maxFundingValue, filters.maxFunding, handleFilterChange]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (payoutProviderNameValue !== filters.payoutProviderName) {
  //       handleFilterChange("payoutProviderName", payoutProviderNameValue);
  //     }
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [payoutProviderNameValue, filters.payoutProviderName, handleFilterChange]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (granteeNameValue !== filters.granteeName) {
  //       handleFilterChange("granteeName", granteeNameValue);
  //     }
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [granteeNameValue, filters.granteeName, handleFilterChange]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onFilterChange(formatDateRangeToFilters(range, filters));
  };

  const handleReset = () => {
    setDateRange(undefined);
    setSearchValue("");
    // setPayoutProviderNameValue("");
    // setGranteeNameValue("");
    onFilterChange(createEmptyFilters());
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full flex flex-col gap-2 md:w-1/3">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search grants..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />

              <Button
                variant="outline"
                className="text-muted-foreground"
                onClick={handleReset}
                disabled={!isThereAnyFilter(filters)}
              >
                <Trash2 className="w-4 h-4 text-destructive/70" /> Reset Filters
              </Button>
            </div>

            {/* {user?.role === "GRANTEE" && (
              <Input
                type="text"
                placeholder="Search by Payout Provider..."
                value={payoutProviderNameValue}
                onChange={(e) => setPayoutProviderNameValue(e.target.value)}
              />
            )}

            {user?.role === "PAYOUT_PROVIDER" && (
              <Input
                type="text"
                placeholder="Search by Grantee Name..."
                value={granteeNameValue}
                onChange={(e) => setGranteeNameValue(e.target.value)}
              />
            )} */}
          </div>

          <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-4 justify-end">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Min amount"
                value={minFundingValue}
                onChange={(e) => setMinFundingValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Max amount"
                value={maxFundingValue}
                onChange={(e) => setMaxFundingValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <DateRangePicker
                date={dateRange}
                onDateChange={handleDateRangeChange}
              />
            </div>

            {user?.role === "PAYOUT_PROVIDER" && (
              <div className="space-y-2">
                <Button
                  className="gap-2"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4" />
                  Create payout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <PayoutFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        mode="create"
      />
    </>
  );
};
