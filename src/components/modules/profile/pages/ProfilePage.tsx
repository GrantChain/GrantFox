"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Grantee, PayoutProvider, User } from "@/generated/prisma";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { ProfileUpdateData } from "../../../../@types/profile";
import { useAuth } from "../../auth/context/AuthContext";
import { GeneralInfoForm } from "../components/GeneralInfoForm";
import { GrantProviderForm } from "../components/GrantProviderForm";
import { GranteeForm } from "../components/GranteeForm";
import { useProfileLoaders } from "../context/ProfileLoadersContext";
import type {
  GeneralInfoFormData,
  GrantProviderFormData,
} from "../schemas/profile.schema";
import { profileService } from "../services/profile.service";

export default function ProfilePage() {
  const { user, grantee, payoutProvider, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { withLoading } = useProfileLoaders();

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateProfile = async (payload: ProfileUpdateData) => {
    // biome-ignore lint/style/noNonNullAssertion: we validated `user` is not null above
    await profileService.update({ userId: user!.user_id, ...payload } as never);

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
      const userPayload: Partial<User> = {
        username: data.username,
        wallet_address: data.wallet_address || null,
        location: data.location || "",
        bio: data.bio || "",
      };
      await withLoading("updateGeneralInfo", async () => {
        await updateProfile({ user: userPayload });
      });
      toast.success("General information updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update general information");
    }
  };

  const handleGrantProviderSubmit = async (data: GrantProviderFormData) => {
    try {
      const providerPayload: Partial<PayoutProvider> = {
        organization_name: data.organization_name,
        network_type: data.network_type || "",
        email: data.email || "",
      };
      await withLoading("updateGrantProvider", async () => {
        await updateProfile({ user: {}, grantProvider: providerPayload });
      });
      toast.success("Grant provider information updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update grant provider information");
    }
  };

  const handleGranteeSubmit = async (
    data: Partial<Omit<Grantee, "user_id" | "created_at" | "updated_at">>,
  ) => {
    try {
      const granteePayload: Partial<Grantee> = {
        name: data.name || "",
        position_title: data.position_title || "",
        social_media: data.social_media ?? null,
      };
      await withLoading("updateGrantee", async () => {
        await updateProfile({ user: {}, grantee: granteePayload });
      });
      toast.success("Grantee information updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update grantee information");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAvatarClick();
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      if (!user) return;
      const { publicUrl } = await profileService.uploadAvatar(
        user.user_id,
        file,
      );
      await updateProfile({
        user: { profile_url: publicUrl } as Partial<User>,
      });
      toast.success("Profile image updated");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error("Failed to upload profile image");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>

          {/* Content skeleton (Profile form) */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full mx-auto">
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
    <div className="container mx-auto max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div
            className="relative group cursor-pointer"
            aria-label="Change profile image"
            onClick={handleAvatarClick}
            onKeyDown={handleAvatarKeyDown}
          >
            <Avatar className="h-28 w-28">
              <AvatarImage
                src={user.profile_url || "/placeholder.svg"}
                alt={user.username || user.email}
              />
              <AvatarFallback>
                {(user.username || user.email || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              {isUploadingPhoto ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                // Using same avatar click affordance, no icon to keep minimal
                <span className="text-xs text-white">Change</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            <Button variant="outline" asChild>
              <Link href={`/dashboard/public-profile/${user.user_id}`}>
                <Eye className="h-4 w-4" />
                View Public Profile
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="w-full">
              Profile
            </TabsTrigger>
            {user.role === "GRANTEE" && (
              <TabsTrigger value="grantee" className="w-full">
                Grantee
              </TabsTrigger>
            )}
            {user.role === "PAYOUT_PROVIDER" && (
              <TabsTrigger value="payout-provider" className="w-full">
                Payout Provider
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <GeneralInfoForm user={user} onSubmit={handleGeneralInfoSubmit} />
          </TabsContent>

          {user.role === "GRANTEE" && (
            <TabsContent value="grantee">
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
            </TabsContent>
          )}

          {user.role === "PAYOUT_PROVIDER" && (
            <TabsContent value="payout-provider">
              <GrantProviderForm
                grantProvider={payoutProvider ?? undefined}
                onSubmit={handleGrantProviderSubmit}
              />
            </TabsContent>
          )}

          {!user.role && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">No Role Selected</h3>
                  <p className="text-muted-foreground">
                    Contact an administrator to assign your role as either a
                    Grant Provider or Grantee.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
    </div>
  );
}
