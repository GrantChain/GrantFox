import { z } from "zod";

export const UserPayloadSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
});
