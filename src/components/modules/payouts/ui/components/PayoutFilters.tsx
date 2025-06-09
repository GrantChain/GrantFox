import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import type { PayoutFilters } from "../../@types/filters.entity";
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
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onFilterChange(formatDateRangeToFilters(range, filters));
  };

  const handleReset = () => {
    setDateRange(undefined);
    setSearchValue("");
    onFilterChange(createEmptyFilters());
  };

  const handleCreatePayout = (data: any) => {
    console.log("Create payout:", data);
    setShowCreateModal(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full flex items-center gap-4 md:w-1/3 space-y-2">
            <Input
              type="text"
              placeholder="Search grants..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <Button
              variant="outline"
              className="!mt-0 text-muted-foreground"
              onClick={handleReset}
              disabled={!isThereAnyFilter(filters)}
            >
              <Trash2 className="w-4 h-4 text-destructive/70" /> Reset Filters
            </Button>
          </div>

          <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-4 justify-end">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Min amount"
                value={filters.minFunding}
                onChange={(e) =>
                  handleFilterChange("minFunding", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Max amount"
                value={filters.maxFunding}
                onChange={(e) =>
                  handleFilterChange("maxFunding", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <DateRangePicker
                date={dateRange}
                onDateChange={handleDateRangeChange}
              />
            </div>

            <div className="space-y-2">
              <Button
                className="gap-2"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4" />
                Create payout
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PayoutFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePayout}
        mode="create"
      />
    </>
  );
};
