import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Grant {
  grant_id: string;
  title: string;
  description: string;
  metrics: string;
  milestones: string;
  status: string;
  total_funding: string;
  currency: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const fetchGrants = async (): Promise<Grant[]> => {
  const { data, error } = await supabase
    .from('grant')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching grants:', error);
    throw error;
  }

  return data || [];
}; 