export interface GrantsFilters {
  search?: string;
  status?: string;
  currency?: string;
  minFunding?: string;
  maxFunding?: string;
  startDate?: string;
  endDate?: string;
}

export interface GrantsPagination {
  page: number;
  pageSize: number;
}
