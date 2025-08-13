"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCopyUtils } from "@/utils/copy.utils";
import { Building, Calendar, Copy, Mail, MapPin, Wallet } from "lucide-react";
import { usePublicProfile } from "../hooks/useUserProfile";

interface PublicProfileClientProps {
  userId: string;
}

export default function PublicProfilePage({
  userId,
}: PublicProfileClientProps) {
  const { profileData, isLoading } = usePublicProfile(userId);
  const { copyText, copiedKeyId } = useCopyUtils();

  if (isLoading || !profileData) {
    return (
      <div className="container mx-auto max-w-4xl p-6 space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2 text-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const { user, grantee, payoutProvider } = profileData;
  const displayName = user.username || user.email || "User";

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage
                src={user.profile_url || "/placeholder.svg"}
                alt={displayName}
              />
              <AvatarFallback className="text-2xl font-semibold">
                {(displayName || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left space-y-2">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              {user.bio && (
                <p className="text-muted-foreground max-w-sm">{user.bio}</p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {user.location && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    {user.location}
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {formatDate(user.created_at)}
                </Badge>
              </div>
            </div>
          </div>

          {grantee && (
            <GranteeSocial
              social={grantee.social_media as Record<string, string> | null}
            />
          )}
        </div>

        {/* Profile Details */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <Badge variant="outline">{user.role}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.wallet_address && (
                  <div className="flex items-center gap-3 flex-wrap">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono truncate max-w-[16rem] md:max-w-[24rem] lg:max-w-[32rem]">
                      {formatWallet(user.wallet_address)}
                    </span>
                    <button
                      type="button"
                      aria-label="Copy wallet address"
                      className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
                      onClick={() =>
                        copyText(user.user_id, user.wallet_address!)
                      }
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copiedKeyId === user.user_id ? "Copied" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {grantee && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {grantee.name && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Name
                      </div>
                      <div className="text-sm">{grantee.name}</div>
                    </div>
                  )}
                  {grantee.position_title && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Position
                      </div>
                      <div className="text-sm">{grantee.position_title}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {payoutProvider && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Payout Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {payoutProvider.organization_name && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Organization
                      </div>
                      <div className="text-sm">
                        {payoutProvider.organization_name}
                      </div>
                    </div>
                  )}
                  {payoutProvider.network_type && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Network
                      </div>
                      <div className="text-sm">
                        {payoutProvider.network_type}
                      </div>
                    </div>
                  )}
                  {payoutProvider.email && (
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Contact Email
                      </div>
                      <div className="text-sm">{payoutProvider.email}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function GranteeSocial({ social }: { social: Record<string, string> | null }) {
  if (!social || (!social.twitter && !social.linkedin && !social.github)) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {social.twitter && (
        <a
          href={social.twitter}
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              fill="currentColor"
              d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36 8.57 8.57 0 0 1-2.71 1.04 4.26 4.26 0 0 0-7.27 3.88 12.1 12.1 0 0 1-8.79-4.46 4.26 4.26 0 0 0 1.32 5.69 4.24 4.24 0 0 1-1.93-.53v.06a4.26 4.26 0 0 0 3.41 4.18 4.3 4.3 0 0 1-1.92.07 4.27 4.27 0 0 0 3.98 2.96A8.54 8.54 0 0 1 2 19.54 12.07 12.07 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.35 8.35 0 0 0 22.46 6z"
            />
          </svg>
        </a>
      )}
      {social.linkedin && (
        <a
          href={social.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              fill="currentColor"
              d="M6.94 6.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.5 8.75h3.5V21H3.5V8.75zm7 0H14v1.68h.05c.63-1.18 2.17-2.43 4.47-2.43 4.78 0 5.66 3.15 5.66 7.25V21h-3.5v-5.6c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95V21h-3.5V8.75z"
            />
          </svg>
        </a>
      )}
      {social.github && (
        <a
          href={social.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.36 1.12 2.94.86.09-.66.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.28 9.28 0 0 1 12 7.5c.86 0 1.72.12 2.52.36 1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.33 4.81-4.55 5.07.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.59.69.49A10.28 10.28 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
            />
          </svg>
        </a>
      )}
    </div>
  );
}

const formatWallet = (address: string): string => {
  if (!address) return "-";
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

const formatDate = (input: string | Date): string => {
  try {
    const d = typeof input === "string" ? new Date(input) : input;
    // format ISO-8601 style to avoid locale mismatch in SSR
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return "-";
  }
};
