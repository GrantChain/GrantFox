"use client";

import { usePublicProfile } from "@/components/modules/profile/hooks/useUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useMemo } from "react";

type EntityCardProps = {
  userId?: string | null;
  name?: string | null;
  imageUrl?: string | null;
  subtitle?: string | null;
  size?: "md" | "lg";
  className?: string;
};

export const EntityCard = ({
  userId,
  name,
  imageUrl,
  subtitle,
  size = "md",
  className = "",
}: EntityCardProps) => {
  const shouldFetch = !name && !imageUrl && Boolean(userId);
  const { profileData, isLoading } = usePublicProfile(userId || "");

  const displayName = useMemo(() => {
    if (name?.trim()) return name;
    const user = profileData?.user;
    const grantee = profileData?.grantee as { name?: string } | undefined;
    return grantee?.name || user?.username || user?.email || "User";
  }, [name, profileData]);

  const displayImageUrl = useMemo(() => {
    if (imageUrl?.trim()) return imageUrl;
    const user = profileData?.user;
    return user?.profile_url || null;
  }, [imageUrl, profileData]);

  const href = userId ? `/dashboard/public-profile/${userId}` : undefined;

  const avatarSize = size === "lg" ? "h-14 w-14" : "h-10 w-10";

  if (shouldFetch && (isLoading || !profileData)) {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border bg-card p-3 ${className}`}
      >
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-36" />
          {subtitle ? <Skeleton className="h-3 w-24" /> : null}
        </div>
      </div>
    );
  }

  const content = (
    <div
      className={`group flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : -1}
    >
      <Avatar className={`${avatarSize}`}>
        <AvatarImage src={displayImageUrl || undefined} alt={displayName} />
        <AvatarFallback className="bg-muted text-muted-foreground">
          {(displayName || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-foreground">
          {displayName}
        </span>
        {subtitle ? (
          <span className="truncate text-xs text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </div>
      <div className="ml-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </div>
  );

  if (href) {
    return (
      <Link target="_blank" href={href} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
};
