import { z } from "zod";

/**
 * Schema for creating a new comment
 */
export const CommentCreateSchema = z.object({
  user_id: z.string().uuid({ message: "user_id must be a valid UUID" }),
  payout_id: z.string().uuid({ message: "payout_id must be a valid UUID" }),
  message: z
    .string({
      required_error: "Message is required",
      invalid_type_error: "Message must be a string",
    })
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .max(500, { message: "Message cannot exceed 500 characters" }),
});

/**
 * Schema for updating a comment
 */
export const CommentUpdateSchema = z.object({
  message: z
    .string({
      required_error: "Message is required",
      invalid_type_error: "Message must be a string",
    })
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .max(500, { message: "Message cannot exceed 500 characters" }),
});

/**
 * Export reusable inferred types
 */
export type CommentCreateInput = z.infer<typeof CommentCreateSchema>;
export type CommentUpdateInput = z.infer<typeof CommentUpdateSchema>;
