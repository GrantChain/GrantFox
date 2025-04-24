export interface Team {
  id: string;
  name: string;
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;
  created_at: Date;
  updated_at: Date;
}
