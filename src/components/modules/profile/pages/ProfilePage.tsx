"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../auth/context/AuthContext";
import type { ProfileUpdateData } from "../@types/profile";
import { GeneralInfoForm } from "../components/GeneralInfoForm";
import { GrantProviderForm } from "../components/GrantProviderForm";
import { GranteeForm } from "../components/GranteeForm";
import type {
  GeneralInfoFormData,
  GrantProviderFormData,
  GranteeFormData,
} from "../schemas/profile.schema";

export default function ProfilePage() {
  const { user, grantee, grantProvider, isLoading } = useAuth();

  const updateProfile = async (payload: ProfileUpdateData) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      // biome-ignore lint/style/noNonNullAssertion: we validated `user` is not null above
      body: JSON.stringify({ userId: user!.user_id, ...payload }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || "Error updating profile");
    }
  };

  const handleGeneralInfoSubmit = async (data: GeneralInfoFormData) => {
    try {
      await updateProfile({ user: data });
      toast.success("General information updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update general information");
    }
  };

  const handleGrantProviderSubmit = async (data: GrantProviderFormData) => {
    try {
      await updateProfile({ user: {}, grantProvider: data });
      toast.success("Grant provider information updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update grant provider information");
    }
  };

  const handleGranteeSubmit = async (data: GranteeFormData) => {
    try {
      await updateProfile({ user: {}, grantee: data });
      toast.success("Grantee information updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update grantee information");
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="space-y-6">
        {/* General Information Form */}
        <GeneralInfoForm user={user} onSubmit={handleGeneralInfoSubmit} />

        {/* Role-Specific Forms */}
        {user.role === "GRANT_PROVIDER" && (
          <GrantProviderForm
            grantProvider={grantProvider ?? undefined}
            onSubmit={handleGrantProviderSubmit}
          />
        )}

        {user.role === "GRANTEE" && (
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
