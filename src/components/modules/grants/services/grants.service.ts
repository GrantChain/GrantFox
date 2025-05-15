import { Grant } from "@/@types/grant.entity";
import { supabase } from "@/lib/supabase";

class GrantsService {
  private readonly TABLE_NAME = "grant";

  async findAll(): Promise<Grant[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching grants: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data;
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
