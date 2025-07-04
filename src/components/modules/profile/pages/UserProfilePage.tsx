"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Building2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  User as UserIcon,
  Wallet,
} from "lucide-react";
import { GrantProviderPublicCard } from "../components/GrantProviderPublicCard";
import { useUserProfile } from "../hooks/useUserProfile";

interface UserProfilePageProps {
  params: Promise<{ userID: string }>;
  showUserIdInHeader?: boolean;
}

export default function UserProfilePage({
  params,
  showUserIdInHeader = false,
}: UserProfilePageProps) {
  const { profileData, isLoading, error, handleBack } = useUserProfile(params);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBack}>
            ← Back
          </Button>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "User profile not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { user, grantee, payoutProvider } = profileData ?? {};
  const socialMedia = grantee?.social_media as {
    twitter?: string;
    linkedin?: string;
    github?: string;
  } | null;

  // Determine if user is a Grant Provider (PAYOUT_PROVIDER)
  const isGrantProvider = user?.role === "PAYOUT_PROVIDER";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack}>
          ← Back
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.profile_url || undefined}
                alt={user?.username || user?.email || "Avatar"}
              />
              <AvatarFallback className="text-lg">
                {(user?.username || user?.email || "U")[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <h1 className="text-2xl font-bold">
                {isGrantProvider
                  ? payoutProvider?.organization_name ||
                    user?.username ||
                    "No name"
                  : grantee?.name || user?.username || "No name"}
              </h1>
              {showUserIdInHeader && user?.user_id && (
                <p className="text-xs text-muted-foreground break-all">
                  User ID: {user.user_id}
                </p>
              )}
              {!isGrantProvider && grantee?.position_title && (
                <p className="text-muted-foreground">
                  {grantee.position_title}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="default">
                  {user?.role
                    ? user.role.toLowerCase().replace("_", " ")
                    : "No role"}
                </Badge>
                {user?.is_active !== undefined && (
                  <Badge
                    variant="outline"
                    className={
                      user.is_active
                        ? "text-green-600 border-green-600"
                        : "text-red-600 border-red-600"
                    }
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
              {user?.bio && <p className="text-muted-foreground">{user.bio}</p>}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email || "Not available"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user?.location || "Not available"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="font-mono text-xs">
                    {user?.wallet_address
                      ? `${user.wallet_address.slice(0, 8)}...${user.wallet_address.slice(-8)}`
                      : "Not available"}
                  </span>
                </div>
              </div>
              {!isGrantProvider &&
                socialMedia &&
                (socialMedia.twitter ||
                  socialMedia.linkedin ||
                  socialMedia.github) && (
                  <div className="flex gap-3">
                    {socialMedia.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {socialMedia.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {socialMedia.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={socialMedia.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Username
              </span>
              <p className="text-sm">{user?.username || "Not available"}</p>
            </div>
            <Separator />
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Email
              </span>
              <p className="text-sm">{user?.email || "Not available"}</p>
            </div>
            <Separator />
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Bio
              </span>
              <p className="text-sm">
                {user?.bio !== undefined ? user.bio : "Not available"}
              </p>
            </div>
            <Separator />
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Role
              </span>
              <p className="text-sm capitalize">
                {user?.role
                  ? user.role.toLowerCase().replace("_", " ")
                  : "Not available"}
              </p>
            </div>
            <Separator />
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Member since
              </span>
              <p className="text-sm">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not available"}
              </p>
            </div>
          </CardContent>
        </Card>
        {isGrantProvider && payoutProvider ? (
          <GrantProviderPublicCard payoutProvider={payoutProvider} />
        ) : grantee ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Grantee Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Full name
                </span>
                <p className="text-sm">{grantee.name || "Not available"}</p>
              </div>
              <Separator />
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Position
                </span>
                <p className="text-sm">
                  {grantee.position_title || "Not available"}
                </p>
              </div>
              <Separator />
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Profile updated
                </span>
                <p className="text-sm">
                  {grantee.updated_at
                    ? new Date(grantee.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not available"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
