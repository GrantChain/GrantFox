export interface GrantProvider {
  user_id: string;
  organization_name?: string;
  network_type?: string;
  email?: string;
  created_at: Date;
  updated_at: Date;
}
