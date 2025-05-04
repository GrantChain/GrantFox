import { z } from "zod";

export const RoleSchema = z.object({
  role: z.enum(["grant_provider", "grantee"]),
});

export const RolePayloadSchema = z.object({
  user_id: z.string(),
  role: z.enum(["grant_provider", "grantee"]), 
});