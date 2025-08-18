import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { useEscrows } from "@/components/modules/escrows/hooks/useEscrows";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import TooltipInfo from "@/components/shared/TooltipInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import Decimal from "decimal.js";
import { Calendar, CircleDollarSign, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { usePayout } from "../../context/PayoutContext";
import { usePayoutMutations } from "../../hooks/usePayoutMutations";
import type { PayoutFormValues } from "../../schemas/payout.schema";
import { statusColors } from "../../utils/card.utils";
import { FundFormModal } from "./FundFormModal";
import { PayoutDetailsSheet } from "./PayoutDetailsSheet";
import { PayoutFormModal } from "./PayoutFormModal";

interface PayoutsCardProps {
  payout: Payout;
  onDelete?: () => void;
  onFund?: () => void;
  onStatusChange?: (status: string) => void;
}

export function PayoutCard({
  payout,
  onDelete,
  onFund,
  onStatusChange,
}: PayoutsCardProps) {
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const { handleFundEscrow } = useEscrows();
  const { handleDeletePayout, isDeleting, getGranteeById, handleUpdateStatus } =
    usePayoutMutations();
  const [, setIsUpdatingStatus] = useState(false);
  const [statusValue, setStatusValue] = useState(payout.status);
  const status = statusValue;

  const [, setIsLoadingEmail] = useState(false);
  const [granteeEmail, setGranteeEmail] = useState<string | null>(null);
  const { escrowBalances, fetchEscrowBalances } = usePayout();

  const escrowBalance = useMemo(() => {
    if (!payout.escrow_id) return 0;
    return escrowBalances[payout.escrow_id] ?? 0;
  }, [escrowBalances, payout.escrow_id]);

  useEffect(() => {
    const fetchGranteeEmail = async () => {
      if (!payout.grantee_id) return;
      setIsLoadingEmail(true);
      try {
        const result = await getGranteeById(payout.grantee_id);
        if (result.exists && result.user) {
          setGranteeEmail(result.user.email);
        }
      } catch (error) {
        console.error("Error fetching grantee email:", error);
      } finally {
        setIsLoadingEmail(false);
      }
    };
    void fetchGranteeEmail();
  }, [payout.grantee_id, getGranteeById]);

  const handleDelete = async () => {
    const success = await handleDeletePayout(payout.payout_id);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };

  // const handleEdit = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (!isLoadingEmail) {
  //     setShowEditModal(true);
  //   }
  // };

  const handleFund = async (amount: number) => {
    if (!payout.payout_id) return;

    try {
      if (payout.escrow_id) {
        const result = await handleFundEscrow({
          amount,
          contractId: payout.escrow_id,
        });

        if (!result) {
          toast.error("Failed to fund escrow");
          return;
        }
      }

      // Force refresh the funded escrow balance immediately in shared cache
      if (payout.escrow_id) {
        await fetchEscrowBalances([payout.escrow_id], { force: true });
      }

      toast.success("Payout funded successfully");
    } catch (error) {
      console.error("Error funding payout:", error);
    }
  };

  const handleChangeStatus = async (val: string) => {
    if (val === statusValue) return;
    try {
      setIsUpdatingStatus(true);
      const updated = await handleUpdateStatus(
        payout.payout_id,
        val as unknown as Payout["status"],
      );
      if (updated) {
        setStatusValue(updated.status);
        toast.success("Status updated");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const initialValues: Partial<PayoutFormValues> = {
    title: payout.title,
    description: payout.description,
    type: payout.type,
    status: payout.status,
    total_funding: Number(payout.total_funding),
    currency: payout.currency,
    image_url: payout.image_url || "",
    grantee_id: granteeEmail || "",
    milestones: Array.isArray(payout.milestones)
      ? payout.milestones.map((milestone) => ({
          description: (milestone as { description: string }).description,
          amount: Number((milestone as { amount: number }).amount),
        }))
      : [],
  };

  return (
    <>
      <Card
        className="w-full max-w-sm shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsSheetOpen(true)}
      >
        <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
          {payout.image_url ? (
            <Image
              src={payout.image_url || "/placeholder.svg"}
              alt={payout.title}
              fill
              className="object-cover hover:scale-105 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
          {(payout.status === "CLOSED" || payout.status === "CANCELED") && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-none">
              <span className="uppercase select-none text-xl font-extrabold tracking-widest px-4 py-2 border-2 border-destructive rounded rotate-[-15deg] drop-shadow-sm text-destructive">
                {payout.status === "CLOSED" ? "Closed" : "Canceled"}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold line-clamp-2 leading-tight">
              {payout.title}
            </h2>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={statusColors[status as Payout["status"]]}
                  className="text-xs font-medium uppercase"
                >
                  {status.toLowerCase()}
                </Badge>
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  {payout.type}
                </span>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(payout.currency, payout.total_funding)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(payout.currency, new Decimal(escrowBalance))}{" "}
                  funded
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {payout.description}
          </p>

          {payout.milestones &&
            Array.isArray(payout.milestones) &&
            payout.milestones.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {Array.isArray(payout.milestones)
                    ? payout.milestones.length
                    : 0}{" "}
                  Milestone
                  {Array.isArray(payout.milestones) &&
                  payout.milestones.length > 1
                    ? "s"
                    : ""}
                </div>
                <div className="text-xs text-muted-foreground">
                  {Array.isArray(payout.milestones) &&
                    payout.milestones
                      .slice(0, 1)
                      .map((milestone: any, index: number) => (
                        <div key={index} className="truncate">
                          {milestone.description} -{" "}
                          {formatCurrency(
                            payout.currency,
                            new Decimal(milestone.amount || 0),
                          )}
                        </div>
                      ))}
                  {Array.isArray(payout.milestones) &&
                    payout.milestones.length > 1 && (
                      <div>+{payout.milestones.length - 1} more</div>
                    )}
                </div>
              </div>
            )}

          <div className="flex items-center justify-between pt-2 border-t border-muted">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{payout.created_at.toLocaleDateString()}</span>
            </div>

            {user?.role === "PAYOUT_PROVIDER" && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete) {
                      onDelete();
                    } else {
                      setIsDeleteDialogOpen(true);
                    }
                  }}
                  disabled={status === "PUBLISHED"}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={status !== "PUBLISHED"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onFund) {
                      onFund();
                    } else {
                      setIsFundDialogOpen(true);
                    }
                  }}
                >
                  <CircleDollarSign className="h-3 w-3" />
                </Button>

                <Select
                  defaultValue={status}
                  onValueChange={(val) => {
                    onStatusChange?.(val);
                    void handleChangeStatus(val);
                  }}
                >
                  <SelectTrigger className="h-8 w-28 md:w-32 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PayoutDetailsSheet
        payout={payout}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Payout"
        description="Are you sure you want to delete this payout? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />

      <PayoutFormModal
        payout={payout}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        initialValues={initialValues}
        mode="edit"
      />

      <FundFormModal
        open={isFundDialogOpen}
        onOpenChange={setIsFundDialogOpen}
        onConfirm={handleFund}
        currency={payout.currency}
        payoutAmount={payout.total_funding}
      />
    </>
  );
}
