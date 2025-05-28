import { ApplicationStatus } from "@/generated/prisma";

export interface Application {
  application_id: string;
  escrow_id: string;
  grant_id: string;
  grantee_id: string;
  project_id: string;
  description: string;
  pitch_url: string;
  motivation: string;
  status: ApplicationStatus;
  created_at: Date;
  updated_at: Date;
}
