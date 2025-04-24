export interface Application {
  id: string;
  grant_id: string;
  user_id: string;
  description?: string;
  pitch_url?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
