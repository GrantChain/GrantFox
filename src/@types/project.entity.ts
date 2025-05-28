import { ProjectStatus, Tags } from "@/generated/prisma";

export interface Project {
  project_id: string;
  team_id: string;
  name: string;
  summary: string;
  repo_url: string;
  website_url: string;
  start_date: Date;
  end_date: Date;
  status: ProjectStatus;
  created_at: Date;
  updated_at: Date;
  pitch_url: string;
  tags: Tags[];
}
