export interface Grantee {
  user_id: string;
  name?: string;
  position_title?: string;
  social_media?: Record<string, any>;
  linked_team_id?: string;
  created_at: Date;
  updated_at: Date;
}
