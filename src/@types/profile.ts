import type { PayoutProvider } from "@/generated/prisma";
import type { Grantee } from "@/generated/prisma";
import type { User } from "@/generated/prisma";

export interface ProfileUpdateData {
  user: Partial<Omit<User, "user_id" | "created_at" | "updated_at">>;
  grantee?: Partial<Omit<Grantee, "user_id" | "created_at" | "updated_at">>;
  grantProvider?: Partial<
    Omit<PayoutProvider, "user_id" | "created_at" | "updated_at">
  >;
}
