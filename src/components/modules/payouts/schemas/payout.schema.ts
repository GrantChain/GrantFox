import { z } from "zod";
import { Currency, PayoutStatus, PayoutType } from "@/generated/prisma";

export const metricSchema = z.object({
  name: z.string().min(1, "Metric name is required"),
  value: z.string().min(1, "Metric value is required"),
});

export const payoutFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  type: z.nativeEnum(PayoutType),
  status: z.nativeEnum(PayoutStatus),
  total_funding: z.string().min(1, "Total funding is required"),
  currency: z.nativeEnum(Currency),
  metrics: z.array(metricSchema).min(1, "At least one metric is required"),
});

export type PayoutFormValues = z.infer<typeof payoutFormSchema>;
