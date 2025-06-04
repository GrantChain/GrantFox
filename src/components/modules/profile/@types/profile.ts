import type { GrantProvider } from '@/@types/grant-provider.entity';
import type { Grantee } from '@/@types/grantee.entity';
import type { User } from '@/@types/user.entity';

export interface ProfileUpdateData {
  user: Partial<Omit<User, 'user_id' | 'created_at' | 'updated_at'>>;
  grantee?: Partial<Omit<Grantee, 'user_id' | 'created_at' | 'updated_at'>>;
  grantProvider?: Partial<
    Omit<GrantProvider, 'user_id' | 'created_at' | 'updated_at'>
  >;
}
