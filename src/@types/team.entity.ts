import { UserRole } from "@/generated/prisma";

export interface Team {
  team_id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  email: string;
  phone: string;
  founded_date: Date;
  website_url: string;
  logo_url: string;
  type: UserRole;
  size: number;
  created_at: Date;
  updated_at: Date;
}
