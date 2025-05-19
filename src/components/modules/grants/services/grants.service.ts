import { Grant } from "@/@types/grant.entity";
import { supabase } from "@/lib/supabase";
import { GrantsFilters } from "../@types/filters.entity";

interface PaginationParams {
  page: number;
  pageSize: number;
}

type FilterKey = keyof GrantsFilters;
type FilterValue = GrantsFilters[FilterKey];

class GrantsService {
  private readonly TABLE_NAME = "grant";

  private buildFilterQuery(query: any, filters?: GrantsFilters) {
    if (!filters) return query;

    const filterMap: Record<FilterKey, (value: FilterValue) => any> = {
      search: (value) => (value ? query.ilike("title", `%${value}%`) : query),
      minFunding: (value) =>
        value ? query.gte("total_funding", value) : query,
      maxFunding: (value) =>
        value ? query.lte("total_funding", value) : query,
      startDate: (value) => (value ? query.gte("created_at", value) : query),
      endDate: (value) => (value ? query.lte("created_at", value) : query),
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value && key in filterMap) {
        query = filterMap[key as FilterKey](value);
      }
    });

    return query;
  }

  private applyPagination(query: any, pagination?: PaginationParams) {
    if (!pagination) return query;

    const { page, pageSize } = pagination;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    return query.range(from, to);
  }

  async findAll(
    filters?: GrantsFilters,
    pagination?: PaginationParams,
  ): Promise<{ data: Grant[]; total: number }> {
    try {
      let query = supabase
        .from(this.TABLE_NAME)
        .select("*", { count: "exact" });

      query = this.buildFilterQuery(query, filters);
      query = this.applyPagination(query, pagination);
      query = query.order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Error fetching grants: ${error.message}`);
      }

      return {
        data: data || [],
        total: count || 0,
      };
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Grant | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .eq("grant_id", id)
        .single();

      if (error) {
        throw new Error(`Error fetching grant: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error in findOne:", error);
      throw error;
    }
  }

  async create(grant: Omit<Grant, "grant_id" | "created_at">): Promise<Grant> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert([grant])
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating grant: ${error.message}`);
      }

      if (!data) {
        throw new Error("Failed to create grant");
      }

      return data;
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  async update(id: string, grant: Partial<Grant>): Promise<Grant> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update(grant)
        .eq("grant_id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating grant: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Grant with ID ${id} not found`);
      }

      return data;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq("grant_id", id);

      if (error) {
        throw new Error(`Error deleting grant: ${error.message}`);
      }
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }
}

export const grantsService = new GrantsService();
