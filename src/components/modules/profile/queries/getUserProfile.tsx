import type { Grantee } from '@/@types/grantee.entity';
import type { User } from '@/@types/user.entity';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  user: User;
  grantee?: Grantee;
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

    // Get role-specific data
    if (user.role === 'GRANT_PROVIDER') {
      console.log('GRANT_PROVIDER');
    } else if (user.role === 'GRANTEE') {
      const { data: grantee, error: granteeError } = await supabase
        .from('grantee')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (granteeError && granteeError.code !== 'PGRST116') {
        throw granteeError;
      }

      if (grantee) {
        profile.grantee = grantee;
      }
    }

    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
