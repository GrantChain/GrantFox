"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PayoutProvider } from "@/generated/prisma";
import { Building2 } from "lucide-react";

interface GrantProviderPublicCardProps {
  payoutProvider: PayoutProvider;
}

export const GrantProviderPublicCard = ({
  payoutProvider,
}: GrantProviderPublicCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Grant Provider Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            Organization Name
          </span>
          <p className="text-sm">
            {payoutProvider.organization_name || "Not available"}
          </p>
        </div>
        <Separator />
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            Network Type
          </span>
          <p className="text-sm">
            {payoutProvider.network_type || "Not available"}
          </p>
        </div>
        <Separator />
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            Organization Email
          </span>
          <p className="text-sm">{payoutProvider.email || "Not available"}</p>
        </div>
        <Separator />
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            Profile updated
          </span>
          <p className="text-sm">
            {payoutProvider.updated_at
              ? new Date(payoutProvider.updated_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )
              : "Not available"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
