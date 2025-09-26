import { z } from "zod";

const ApplicationStatus = z.enum(["PENDING", "APPROVED", "REJECTED"]);

const cuidRegex = /^[a-z0-9]{25}$/;

export const bountyApplicationCreateSchema = z.object({
  payout_id: z.string().regex(cuidRegex, {
    message: "Invalid user ID format (must be valid CUID)",
  }),
  grantee_id: z.string().regex(cuidRegex, {
    message: "Invalid user ID format (must be valid CUID)",
  }),
  application_status: ApplicationStatus,
});

export const bountyApplicationUpdateSchema = z.object({
  application_status: ApplicationStatus,
});
