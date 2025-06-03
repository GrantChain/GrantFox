import type { User } from '@/@types/user.entity';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  user: User;
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userError) throw userError;
    if (!user) return null;

    const profile: UserProfile = { user };

    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
