import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { GrantsFilters } from "../../@types/filters.entity";

interface GrantFiltersProps {
  onFilterChange: (filters: GrantsFilters) => void;
  filters: GrantsFilters;
}

export const GrantFilters = ({
  onFilterChange,
  filters,
}: GrantFiltersProps) => {
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      search: "",
      status: "all",
      currency: "all",
      minFunding: "",
      maxFunding: "",
      startDate: "",
      endDate: "",
    };
    onFilterChange(emptyFilters);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <Input
            type="text"
            placeholder="Search grants..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Currency</label>
          <Select
            value={filters.currency}
            onValueChange={(value) => handleFilterChange("currency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Min Funding</label>
          <Input
            type="number"
            placeholder="Min amount"
            value={filters.minFunding}
            onChange={(e) => handleFilterChange("minFunding", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Max Funding</label>
          <Input
            type="number"
            placeholder="Max amount"
            value={filters.maxFunding}
            onChange={(e) => handleFilterChange("maxFunding", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
    </Card>
  );
};
