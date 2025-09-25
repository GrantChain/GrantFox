import { z } from "zod";

/**
 * Enum validation for Application Status
 */
export const ApplicationStatusEnum = z.enum(
  ["APPROVED", "REJECTED", "PENDING"],
  {
    required_error: "Application status is required",
    invalid_type_error: "Invalid application status",
  },
);

/**
 * Schema for creating a new bounty application
 */
export const BountyApplicationCreateSchema = z.object({
  payout_id: z.string().uuid({ message: "payout_id must be a valid UUID" }),
  grantee_id: z.string().uuid({ message: "grantee_id must be a valid UUID" }),
});

/**
 * Schema for updating a bounty application (status updates)
 */
export const BountyApplicationUpdateSchema = z.object({
  status: ApplicationStatusEnum,
});

/**
 * Export reusable inferred types
 */
export type BountyApplicationCreateInput = z.infer<
  typeof BountyApplicationCreateSchema
>;
export type BountyApplicationUpdateInput = z.infer<
  typeof BountyApplicationUpdateSchema
>;
