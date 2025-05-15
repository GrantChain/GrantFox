import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GrantsFilters } from "../../@types/filters.entity";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Trash2 } from "lucide-react";
import {
  createEmptyFilters,
  formatDateRangeToFilters,
  createInitialDateRange,
  isThereAnyFilter,
} from "../../utils/filter.utils";

interface GrantFiltersProps {
  onFilterChange: (filters: GrantsFilters) => void;
  filters: GrantsFilters;
}

export const GrantFilters = ({
  onFilterChange,
  filters,
}: GrantFiltersProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    createInitialDateRange(filters),
  );
  const [searchValue, setSearchValue] = useState(filters.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        handleFilterChange("search", searchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onFilterChange(formatDateRangeToFilters(range, filters));
  };

  const handleReset = () => {
    setDateRange(undefined);
    setSearchValue("");
    onFilterChange(createEmptyFilters());
  };

  return (
    <>
      <div className="flex flex-col gap-4">
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
          </div>
        </div>
      </div>
    </>
  );
};
