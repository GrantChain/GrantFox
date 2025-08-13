import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalWalletStore } from "@/components/wallet/store/store";
import type { Payout } from "@/generated/prisma";
import { useIsMobile, useIsTabletOrBelow } from "@/hooks/useMobile";
import { formatCurrency } from "@/utils/format.utils";
import Decimal from "decimal.js";
import {
  Calendar,
  DollarSign,
  ExternalLink,
  FileText,
  List,
  Loader2,
  User,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePayout } from "../../context/PayoutContext";
import { usePayoutSheet } from "../../hooks/usePayoutSheet";
import { statusColors } from "../../utils/card.utils";
import { GranteeDetailsCard } from "./GranteeDetailsCard";
import { ManageMilestonesDialog } from "./ManageMilestonesDialog";
import { useEscrows } from "@/components/modules/escrows/hooks/useEscrows";
import { usePayoutMutations } from "../../hooks/usePayoutMutations";
import type { Prisma } from "@/generated/prisma";

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
  const statusColor = statusColors[payout.status];

  const [escrowBalance, setEscrowBalance] = useState<number | null>(null);
  const { address } = useGlobalWalletStore();
  const { fetchEscrowBalances, escrowBalances } = usePayout();
  const isMobile = useIsMobile();
  const isTabletOrBelow = useIsTabletOrBelow();

  const {
    fetchSelectedGrantee,
    fetchCreator,
    isLoading,
    isLoadingCreator,
    error,
  } = usePayoutSheet();
  const { selectedGrantee, creator, setSelectedGrantee, setCreator } =
    usePayout();
  const { user } = useAuth();
  const [isManageMilestonesOpen, setIsManageMilestonesOpen] = useState(false);
  const { handleGetEscrowByContractIds } = useEscrows();
  const { updatePayoutMilestones } = usePayoutMutations();

  const handleOpenManageMilestones = async () => {
    try {
      if (payout.escrow_id) {
        const escrow = await handleGetEscrowByContractIds([payout.escrow_id]);
        const escrowItem = Array.isArray(escrow) ? escrow[0] : escrow;
        const milestonesFromEscrow = (escrowItem?.milestones || []) as Array<{
          flags?: { resolved?: boolean };
        }>;

        const currentMilestones =
          (payout.milestones as unknown as Milestone[]) || [];
        let changed = false;
        const nextMilestones = currentMilestones.map((m, idx) => {
          const escrowResolved = Boolean(
            (
              milestonesFromEscrow[idx]?.flags as
                | { resolved?: boolean }
                | undefined
            )?.resolved,
          );
          const escrowDisputed = Boolean(
            (
              milestonesFromEscrow[idx]?.flags as
                | { disputed?: boolean }
                | undefined
            )?.disputed,
          );
          const prevFlags =
            (
              m as unknown as {
                flags?: { resolved?: boolean; disputed?: boolean };
              }
            ).flags || {};
          const wasResolved = Boolean(prevFlags.resolved);
          const wasDisputed = Boolean(prevFlags.disputed);

          if (!escrowResolved) {
            return m;
          }

          const nextFlags = {
            ...prevFlags,
            resolved: true,
            disputed: escrowDisputed,
          };

          if (
            nextFlags.resolved !== wasResolved ||
            nextFlags.disputed !== wasDisputed
          ) {
            changed = true;
            return { ...m, flags: nextFlags } as Milestone;
          }
          return m;
        });

        if (changed) {
          await updatePayoutMilestones.mutateAsync({
            id: payout.payout_id,
            milestones: nextMilestones as unknown as Prisma.JsonValue,
          });
          await fetchEscrowBalances([payout.escrow_id], { force: true });
        }
      }
    } finally {
      setIsManageMilestonesOpen(true);
    }
  };

  const cachedBalance = useMemo(() => {
    if (!payout.escrow_id) return null;
    const val = escrowBalances[payout.escrow_id];
    return typeof val === "number" ? val : null;
  }, [escrowBalances, payout.escrow_id]);

  // Load grantee/creator only when open is true
  useEffect(() => {
    if (!open) return;
    const run = async () => {
      if (payout.grantee_id) {
        await fetchSelectedGrantee(payout.grantee_id);
      }
      if (payout.created_by) {
        await fetchCreator(payout.created_by);
      }
    };
    void run();
  }, [
    open,
    payout.grantee_id,
    payout.created_by,
    fetchSelectedGrantee,
    fetchCreator,
  ]);

  // Fetch balance once per open (even if key is same), and also when key changes while open.
  const wasOpenRef = useRef<boolean>(false);
  const lastFetchedKeyRef = useRef<string | null>(null);

  // Edge: open transition (false -> true)
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      wasOpenRef.current = true;
      // Only fetch if not cached or stale: handled by context fetcher
      if (payout.escrow_id) {
        void fetchEscrowBalances([payout.escrow_id]);
      }
    }
    if (!open && wasOpenRef.current) {
      wasOpenRef.current = false;
    }
  }, [open]);

  // Changes in signer or escrow while open
  useEffect(() => {
    if (!open) return;
    const currentKey = `${address || "no-address"}-${payout.escrow_id || "no-escrow"}`;
    if (lastFetchedKeyRef.current !== currentKey) {
      lastFetchedKeyRef.current = currentKey;
      if (payout.escrow_id) {
        void fetchEscrowBalances([payout.escrow_id]);
      }
    }
  }, [open, payout.escrow_id, address, fetchEscrowBalances]);

  // Keep local state in sync for rendering
  useEffect(() => {
    setEscrowBalance(cachedBalance);
  }, [cachedBalance]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedGrantee(null);
      setCreator(null);
    }
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
          {/* Mobile close button */}
          {isMobile && (
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors z-10"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-2 md:col-span-1">
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

            <Card className="col-span-2 md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {escrowBalance !== null ? (
                    <span>
                      {formatCurrency(
                        payout.currency,
                        new Decimal(escrowBalance),
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground flex gap-2">
                    {payout.created_at.toLocaleDateString()}
                    <span className="text-muted-foreground">
                      {payout.created_at.toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Link
                    href={`https://stellar.expert/explorer/testnet/contract/${payout.escrow_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground gap-2 flex items-center hover:underline"
                  >
                    Stellar Explorer
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`https://viewer.trustlesswork.com/${payout.escrow_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground gap-2 flex items-center hover:underline"
                  >
                    Escrow Viewer
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {user?.role === "GRANTEE" && (
              <Link
                href={`/dashboard/public-profile/${creator?.user_id}`}
                className="col-span-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card>
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
              </Link>
            )}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between items-center gap-2">
                <div className="flex gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {payout.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between pb-2 items-center">
              <CardTitle className="text-base">Milestones</CardTitle>
              {isTabletOrBelow ? (
                <Link
                  href={`/dashboard/payout-provider/payouts/${payout.payout_id}/milestones`}
                >
                  <Button variant="outline" className="text-sm gap-2">
                    <List className="h-4 w-4" />
                    Manage Milestones
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  className="text-sm gap-2"
                  onClick={handleOpenManageMilestones}
                  disabled={payout.status !== "PUBLISHED"}
                >
                  <List className="h-4 w-4" />
                  Manage Milestones
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pr-2 max-h-56 overflow-auto">
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
                            new Decimal(milestone.amount),
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
              ) : selectedGrantee ? (
                <GranteeDetailsCard
                  selectedGrantee={selectedGrantee}
                  showTitle={false}
                  lessInfo
                />
              ) : null}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
      <ManageMilestonesDialog
        open={isManageMilestonesOpen}
        onOpenChange={setIsManageMilestonesOpen}
        payout={payout}
      />
    </Sheet>
  );
}
