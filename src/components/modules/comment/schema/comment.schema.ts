import { z } from "zod";

export const commentCreateSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be at most 500 characters"),
  user_id: z.string().uuid({
    message: "Invalid user ID format (must be valid CUID)",
  }),
  payout_id: z.string().uuid({
    message: "Invalid payout ID format (must be valid CUID)",
  }),
});

export const commentUpdateSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be at most 500 characters"),
});
