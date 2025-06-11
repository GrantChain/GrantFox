import { Currency, PayoutStatus, PayoutType } from "@/generated/prisma";
import { z } from "zod";

export const milestoneSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z
    .union([z.string().min(1, "Amount is required"), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        const num = Number(val);
        if (Number.isNaN(num)) throw new Error("Amount must be a valid number");
        return num;
      }
      return val;
    })
    .refine((val) => val > 0, "Amount must be greater than 0"),
});

export type MilestoneFormValues = {
  description: string;
  amount: string | number;
};

export const payoutFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  type: z.nativeEnum(PayoutType),
  status: z.nativeEnum(PayoutStatus),
  total_funding: z.string().min(1, "Total funding is required"),
  currency: z.nativeEnum(Currency),
  milestones: z
    .array(milestoneSchema)
    .min(1, "At least one milestone is required"),
  grantee_id: z.string().email("Must be a valid email").optional(),
});

export type PayoutFormValues = z.infer<typeof payoutFormSchema>;
