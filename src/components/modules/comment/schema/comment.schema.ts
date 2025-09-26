import { z } from "zod";

const cuidRegex = /^[a-z0-9]{25}$/;

export const commentCreateSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be at least 500 characters"),
  user_id: z.string().regex(cuidRegex, {
    message: "Invalid user ID format (must be valid CUID)",
  }),
  payout_id: z.string().regex(cuidRegex, {
    message: "Invalid payout ID format (must be valid CUID)",
  }),
});

export const commentUpdateSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be at least 500 characters"),
});
