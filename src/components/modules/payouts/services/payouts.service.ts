import type { Pagination } from "@/@types/pagination.entity";
import type { Currency, Payout, PayoutStatus } from "@/generated/prisma";
import { http } from "@/lib/axios";
import { supabase } from "@/lib/supabase";
import { Decimal } from "decimal.js";
import type { PayoutFilters } from "../@types/filters.entity";

type FilterKey = keyof PayoutFilters;
type FilterValue = PayoutFilters[FilterKey];
type SupabaseQuery = any;

class PayoutsService {
  private readonly TABLE_NAME = "payout";

  private transformPayout(payout: Payout): Payout {
    return {
      ...payout,
      created_at: new Date(payout.created_at),
      updated_at: new Date(payout.updated_at),
      status: payout.status as PayoutStatus,
      currency: payout.currency as Currency,
      total_funding: new Decimal(payout.total_funding),
    };
  }

  private buildFilterQuery(query: SupabaseQuery, filters?: PayoutFilters) {
    if (!filters) return query;

    let filteredQuery = query;

    const filterMap: Record<FilterKey, (value: FilterValue) => SupabaseQuery> =
      {
        search: (value) =>
          value ? filteredQuery.ilike("title", `%${value}%`) : filteredQuery,
        minFunding: (value) =>
          value ? filteredQuery.gte("total_funding", value) : filteredQuery,
        maxFunding: (value) =>
          value ? filteredQuery.lte("total_funding", value) : filteredQuery,
        startDate: (value) =>
          value ? filteredQuery.gte("created_at", value) : filteredQuery,
        endDate: (value) =>
          value ? filteredQuery.lte("created_at", value) : filteredQuery,
      };

    for (const [key, value] of Object.entries(filters)) {
      if (value && key in filterMap) {
        filteredQuery = filterMap[key as FilterKey](value);
      }
    }

    return filteredQuery;
  }

  private applyPagination(query: SupabaseQuery, pagination?: Pagination) {
    if (!pagination) return query;

    const { page, pageSize } = pagination;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    return query.range(from, to);
  }

  async findAll(
    filters?: PayoutFilters,
    pagination?: Pagination,
  ): Promise<{ data: Payout[]; total: number }> {
    try {
      const baseQuery = supabase
        .from(this.TABLE_NAME)
        .select("*", { count: "exact" });

      let query = this.buildFilterQuery(baseQuery, filters);
      query = this.applyPagination(query, pagination);
      query = query.order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Error fetching payouts: ${error.message}`);
      }

      return {
        data: (data || []).map(this.transformPayout),
        total: count || 0,
      };
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Payout | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .eq("payout_id", id)
        .single();

      if (error) {
        throw new Error(`Error fetching payout: ${error.message}`);
      }

      return data ? this.transformPayout(data) : null;
    } catch (error) {
      console.error("Error in findOne:", error);
      throw error;
    }
  }

  async create(
    payout: Omit<Payout, "payout_id" | "created_at" | "updated_at">,
  ): Promise<Payout> {
    try {
      const response = await http.post<Payout>("/payout/create", payout);
      return this.transformPayout(response.data);
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  async update(id: string, payout: Partial<Payout>): Promise<Payout> {
    try {
      const response = await http.put<Payout>(`/payout/update/${id}`, payout);
      return this.transformPayout(response.data);
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await http.delete(`/payout/delete/${id}`);
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }
}

export const payoutsService = new PayoutsService();
