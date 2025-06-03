'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { GeneralInfoForm } from '../components/GeneralInfoForm';
import { GranteeForm } from '../components/GranteeForm';
import { useUserProfile } from '../hooks/useUserProfile';
import type {
  GeneralInfoFormData,
  GranteeFormData,
} from '../schemas/profile.schema';

export default function ProfilePage() {
  const { profile, loading, error, refetch } = useUserProfile();

  const handleGeneralInfoSubmit = (data: GeneralInfoFormData) => {
    console.log(data);
  };

  const handleGranteeSubmit = async (data: GranteeFormData) => {
    console.log(data);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>

          <Card>
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
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </div>

        {/* General Information Form */}
        <GeneralInfoForm
          user={profile.user}
          onSubmit={handleGeneralInfoSubmit}
        />

        {profile.user.role === 'GRANTEE' && (
          <GranteeForm
            grantee={profile.grantee}
            onSubmit={handleGranteeSubmit}
          />
        )}

        {/* Role Selection Info */}
        {!profile.user.role && (
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
