import * as z from "zod";

export const ticketCreateSchema = z.object({
  user_id: z.string().cuid().optional(),
  category: z.enum(["BUG", "FEATURE", "QUESTION"], {
    required_error: "Category is required",
    invalid_type_error: "Invalid category",
  }),
  subject: z
    .string({ required_error: "Subject is required" })
    .min(5, "Subject must be at least 5 characters")
    .max(120, "Subject must not exceed 120 characters"),
  message: z
    .string({ required_error: "Message is required" })
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must not exceed 2000 characters"),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.string().optional(),
        size: z.number().optional(),
      }),
    )
    .optional(),
});

export type TicketCreateInput = z.infer<typeof ticketCreateSchema>;

export const ticketStatusUpdateSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status",
  }),
});

export type TicketStatusUpdateInput = z.infer<typeof ticketStatusUpdateSchema>;
