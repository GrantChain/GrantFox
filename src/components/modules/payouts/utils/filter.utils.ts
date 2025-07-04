import type { DateRange } from "react-day-picker";
import type { PayoutFilters } from "../@types/filters.entity";

export const createEmptyFilters = (): PayoutFilters => ({
  search: "",
  minFunding: "",
  maxFunding: "",
  startDate: "",
  endDate: "",
  payoutProviderName: "",
  granteeName: "",
});

export const isThereAnyFilter = (filters: PayoutFilters): boolean => {
  return (
    filters.search !== "" ||
    filters.minFunding !== "" ||
    filters.maxFunding !== "" ||
    filters.payoutProviderName !== "" ||
    filters.granteeName !== ""
  );
};

export const formatDateRangeToFilters = (
  range: DateRange | undefined,
  currentFilters: PayoutFilters,
): PayoutFilters => ({
  ...currentFilters,
  startDate: range?.from?.toISOString().split("T")[0] || "",
  endDate: range?.to?.toISOString().split("T")[0] || "",
});

export const createInitialDateRange = (
  filters: PayoutFilters,
): DateRange | undefined => ({
  from: filters.startDate ? new Date(filters.startDate) : undefined,
  to: filters.endDate ? new Date(filters.endDate) : undefined,
});