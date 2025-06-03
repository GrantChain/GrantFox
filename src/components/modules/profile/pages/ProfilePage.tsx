'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useUser } from '../../auth/context/UserContext';
import { GeneralInfoForm } from '../components/GeneralInfoForm';
import { GrantProviderForm } from '../components/GrantProviderForm';
import { GranteeForm } from '../components/GranteeForm';
import type {
  GeneralInfoFormData,
  GrantProviderFormData,
  GranteeFormData,
} from '../schemas/profile.schema';

export default function ProfilePage() {
  const { user, grantee, grantProvider, isLoading } = useUser();

  const handleGeneralInfoSubmit = (data: GeneralInfoFormData) => {
    console.log(data);
  };

  const handleGrantProviderSubmit = async (data: GrantProviderFormData) => {
    console.log(data);
  };

  const handleGranteeSubmit = async (data: GranteeFormData) => {
    console.log(data);
  };

  if (isLoading) {
    return (
      <div className="max-w-[90rem] mx-auto">
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: safe to use index for static skeletons
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-[90rem] mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No profile data found. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-[90rem] mx-auto">
      <div className="space-y-6">
        {/* General Information Form */}
        <GeneralInfoForm user={user} onSubmit={handleGeneralInfoSubmit} />

        {/* Role-Specific Forms */}
        {user.role === 'GRANT_PROVIDER' && (
          <GrantProviderForm
            grantProvider={grantProvider ?? undefined}
            onSubmit={handleGrantProviderSubmit}
          />
        )}

        {user.role === 'GRANTEE' && (
          <GranteeForm
            grantee={grantee ?? undefined}
            onSubmit={handleGranteeSubmit}
          />
        )}

        {/* Role Selection Info */}
        {!user.role && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No Role Selected</h3>
                <p className="text-muted-foreground">
                  Contact an administrator to assign your role as either a Grant
                  Provider or Grantee.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
