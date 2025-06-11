import type { Pagination } from "@/@types/pagination.entity";
import type {
  Currency,
  Payout,
  PayoutStatus,
  UserRole,
} from "@/generated/prisma";
import { http } from "@/lib/axios";
import { Decimal } from "decimal.js";
import type { PayoutFilters } from "../@types/filters.entity";

class PayoutsService {
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

  async findAll(
    filters?: PayoutFilters,
    pagination?: Pagination,
    role?: UserRole,
    userId?: string,
  ): Promise<{ data: Payout[]; total: number }> {
    try {
      const response = await http.post<{ data: Payout[]; total: number }>(
        "/payout/find-all",
        {
          filters,
          pagination,
          role,
          userId,
        },
      );

      return {
        data: response.data.data.map(this.transformPayout),
        total: response.data.total,
      };
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Payout | null> {
    try {
      const response = await http.get<Payout>(`/payout/find-one/${id}`);
      return response.data ? this.transformPayout(response.data) : null;
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
