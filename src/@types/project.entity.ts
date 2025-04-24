export interface Project {
  id: string;
  team_id: string;
  name: string;
  summary?: string;
  repo_url?: string;
  pitch_url?: string;
  created_at: Date;
  updated_at: Date;
}
