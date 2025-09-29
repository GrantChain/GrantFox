import { z } from "zod";

const ApplicationStatus = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const bountyApplicationCreateSchema = z.object({
  payout_id: z.string().uuid({
    message: "Invalid user ID format (must be valid CUID)",
  }),
  grantee_id: z.string().uuid({
    message: "Invalid user ID format (must be valid CUID)",
  }),
  application_status: ApplicationStatus,
});

export const bountyApplicationUpdateSchema = z.object({
  application_status: ApplicationStatus,
});

export type bountyApplicationCreateInput = z.infer<
  typeof bountyApplicationCreateSchema
>;

export type bountyApplicationUpdateInput = z.infer<
  typeof bountyApplicationUpdateSchema
>;
