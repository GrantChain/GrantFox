import { UserRole } from "@/generated/prisma";

export interface User {
  user_id: string;
  email: string;
  profile_url?: string;
  cover_url?: string;
  location?: string;
  role: UserRole;
  bio?: string;
  wallet_address?: string;
  username?: string;
  is_active?: boolean;
  created_at: Date;
  updated_at: Date;
}

export type UserPayload = Pick<User, "user_id" | "email">;
