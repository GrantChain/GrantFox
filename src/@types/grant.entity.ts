import { GrantStatus, Currency } from "@/generated/prisma";

export interface Grant {
  grant_id: string;
  title: string;
  description: string;
  metrics: string;
  status: GrantStatus;
  total_funding: number;
  currency: Currency;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}
