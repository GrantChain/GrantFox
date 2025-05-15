import { DateRange } from "react-day-picker";
import { GrantsFilters } from "../@types/filters.entity";

export const createEmptyFilters = (): GrantsFilters => ({
  search: "",
  minFunding: "",
  maxFunding: "",
  startDate: "",
  endDate: "",
});

export const isThereAnyFilter = (filters: GrantsFilters): boolean => {
  return (
    filters.search !== "" ||
    filters.minFunding !== "" ||
    filters.maxFunding !== ""
  );
};

export const formatDateRangeToFilters = (
  range: DateRange | undefined,
  currentFilters: GrantsFilters,
): GrantsFilters => ({
  ...currentFilters,
  startDate: range?.from?.toISOString().split("T")[0] || "",
  endDate: range?.to?.toISOString().split("T")[0] || "",
});

export const createInitialDateRange = (
  filters: GrantsFilters,
): DateRange | undefined => ({
  from: filters.startDate ? new Date(filters.startDate) : undefined,
  to: filters.endDate ? new Date(filters.endDate) : undefined,
});
