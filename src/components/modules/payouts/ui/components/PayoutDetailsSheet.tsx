import { useUser } from "@/components/modules/auth/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import { Calendar, DollarSign, FileText, User, Wallet } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePayout } from "../../context/PayoutContext";
import { usePayoutSheet } from "../../hooks/usePayoutSheet";
import { statusColors } from "../../utils/card.utils";
import { GranteeDetailsCard } from "./GranteeDetailsCard";

// todo: add from tw
type Milestone = {
  description: string;
  amount: number;
};

interface PayoutDetailsSheetProps {
  payout: Payout;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayoutDetailsSheet({
  payout,
  open,
  onOpenChange,
}: PayoutDetailsSheetProps) {
  const statusColor =
    statusColors[payout.status as keyof typeof statusColors] ||
    statusColors.DRAFT;

  const { fetchUser, fetchCreator, isLoading, isLoadingCreator, error } =
    usePayoutSheet();
  const { user: grantee, creator, setUser, setCreator } = usePayout();
  const { user } = useUser();

  useEffect(() => {
    const loadData = async () => {
      setUser(null);
      setCreator(null);

      if (open && payout.grantee_id && payout.created_by) {
        await fetchUser(payout.grantee_id);
        await fetchCreator(payout.created_by);
      }
    };

    loadData();
  }, [
    open,
    payout.grantee_id,
    payout.created_by,
    fetchUser,
    fetchCreator,
    setUser,
    setCreator,
  ]);

  const handleOpenChange = (newOpen: boolean) => {
    setUser(null);
    onOpenChange(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col [&>button]:hidden">
        <div className="relative h-48 w-full">
          {payout.image_url ? (
            <>
              <Image
                src={payout.image_url}
                alt={payout.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Wallet className="w-12 h-12 " />
                </div>
                <h2 className="text-xl font-semibold">No Image Available</h2>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-start justify-between">
              <SheetTitle className="text-xl font-bold text-white drop-shadow-lg">
                {payout.title}
              </SheetTitle>
              <Badge
                className={`${statusColor} backdrop-blur-sm`}
                variant="outline"
              >
                {payout.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Funding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {formatCurrency(payout.currency, payout.total_funding)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {payout.created_at.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {payout.created_at.toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {user?.role === "GRANTEE" && (
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Created By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingCreator ? (
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : creator ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Organization:
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {creator?.organization_name || "No set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Network Type:
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {creator?.network_type || "No set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm text-muted-foreground">
                          {creator?.email || "No set"}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {payout.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pr-2">
                {(payout?.milestones as Milestone[])?.map(
                  (milestone, index) => (
                    <div
                      key={`${milestone.description}-${milestone.amount}-${index}`}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {milestone.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Amount:{" "}
                          {formatCurrency(
                            payout.currency,
                            milestone.amount.toString(),
                          )}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Grantee Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : error ? (
                <div className="text-destructive">
                  Error loading user details: {error.message}
                </div>
              ) : grantee ? (
                <GranteeDetailsCard user={grantee} showTitle={false} lessInfo />
              ) : null}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
