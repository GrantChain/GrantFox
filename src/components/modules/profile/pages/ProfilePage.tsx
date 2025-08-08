"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { ProfileUpdateData } from "../../../../@types/profile";
import { useAuth } from "../../auth/context/AuthContext";
import { GeneralInfoForm } from "../components/GeneralInfoForm";
import { GrantProviderForm } from "../components/GrantProviderForm";
import { GranteeForm } from "../components/GranteeForm";
import type {
  GeneralInfoFormData,
  GrantProviderFormData,
  GranteeFormData,
} from "../schemas/profile.schema";

export default function ProfilePage() {
  const { user, grantee, payoutProvider, isLoading } = useAuth();
  const queryClient = useQueryClient();

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

    // Invalidate cached user queries so changes reflect immediately
    if (user?.user_id) {
      queryClient.invalidateQueries({
        queryKey: ["user-by-id", "GRANTEE", user.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-role-by-id", "GRANTEE", user.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-role-by-id", "PAYOUT_PROVIDER", user.user_id],
      });
      queryClient.invalidateQueries({ queryKey: ["user-data", user.user_id] });
      queryClient.invalidateQueries({ queryKey: ["role-data", user.user_id] });
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
        {user.role === "PAYOUT_PROVIDER" && (
          <GrantProviderForm
            grantProvider={payoutProvider ?? undefined}
            onSubmit={handleGrantProviderSubmit}
          />
          // todo: refact to payout provider form
        )}

        {user.role === "GRANTEE" && (
          <GranteeForm
            grantee={
              grantee
                ? {
                    ...grantee,
                    social_media: (grantee.social_media as {
                      twitter: string;
                      linkedin: string;
                      github: string;
                    }) || { twitter: "", linkedin: "", github: "" },
                  }
                : undefined
            }
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
