import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { User } from "@/generated/prisma";

interface GranteeDetailsCardProps {
  user: User | null;
  showLink?: boolean;
}

export const GranteeDetailsCard = ({
  user,
  showLink = true,
}: GranteeDetailsCardProps) => {
  const content = (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Grantee Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user?.profile_url || undefined}
                alt={user?.username || user?.email}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.username?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.username || user?.email}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Username</span>
              <span className="text-sm max-w-[200px] truncate">
                {user?.username || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm max-w-[200px] truncate">
                {user?.location || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Wallet</span>
              <span className="text-sm font-mono max-w-[200px] truncate">
                {user?.wallet_address ? (
                  `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`
                ) : (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </span>
            </div>

            <div className="flex flex-col justify-start items-start w-full">
              <span className="text-sm text-muted-foreground">Bio</span>
              <span className="text-sm line-clamp-4 w-full">
                {user?.bio || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-muted">
              <span className="text-lg text-muted-foreground">?</span>
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium">No Grantee Selected</p>
            <p className="text-xs text-muted-foreground">
              Enter a valid grantee email below to continue
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showLink) {
    return (
      <Link href={`/profile/${user.user_id}`} target="_blank">
        {content}
      </Link>
    );
  }

  return content;
};
