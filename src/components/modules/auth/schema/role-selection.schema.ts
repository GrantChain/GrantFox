import { z } from "zod";

export const RoleSchema = z.object({
  role: z.enum(["PAYOUT_PROVIDER", "GRANTEE"]),
});

export const RolePayloadSchema = z.object({
  user_id: z.string(),
  role: z.enum(["PAYOUT_PROVIDER", "GRANTEE"]),
});
