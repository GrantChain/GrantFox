export interface Grant {
  id: string;
  grant_provider_id: string;
  project_id?: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}
