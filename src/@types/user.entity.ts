export interface User {
  id: string;
  email: string;
  full_name: string;
  pfp_url?: string;
  location?: string;
  role: string;
  team_id?: string;
  created_at: Date;
  updated_at: Date;
}
