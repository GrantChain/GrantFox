import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { useEscrows } from "@/components/modules/escrows/hooks/useEscrows";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import TooltipInfo from "@/components/shared/TooltipInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import Decimal from "decimal.js";
import {
  Calendar,
  CircleDollarSign,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
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
}

export function PayoutCard({ payout }: PayoutsCardProps) {
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const { handleFundEscrow } = useEscrows();
  const { handleDeletePayout, isDeleting, getGranteeById } =
    usePayoutMutations();
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoadingEmail) {
      setShowEditModal(true);
    }
  };

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
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsSheetOpen(true)}
      >
        <div className="relative w-full h-48 overflow-hidden">
          {payout.image_url ? (
            <Image
              src={payout.image_url}
              alt={payout.title}
              fill
              className="object-cover hover:scale-105 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <Badge
            variant={statusColors[payout.status]}
            className="absolute top-2 right-2 text-xs"
          >
            {payout.status}
          </Badge>
        </div>

        <CardContent className="p-5">
          {/* Header with Title and Price */}
          <div className="flex justify-between items-center gap-4 mb-3">
            <h2 className="text-lg font-semibold line-clamp-2 flex-1 leading-tight">
              {payout.title}
            </h2>

            <div className="text-2xl font-bold text-primary shrink-0">
              {payout.currency && (
                <span className="text-lg font-medium text-muted-foreground mr-2">
                  {payout.currency}
                </span>
              )}
              <span>
                {formatCurrency(undefined, new Decimal(escrowBalance || 0))}
              </span>

              <span className="text-muted-foreground mx-1">/</span>
              <span>
                {formatCurrency(undefined, new Decimal(payout.total_funding))}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
            {payout.description}
          </p>

          <div className="mt-4 flex justify-between items-center">
            {user?.role === "PAYOUT_PROVIDER" && (
              <div className="flex gap-2">
                {/* <TooltipInfo content="Edit">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleEdit}
                    disabled={isLoadingEmail}
                  >
                    {isLoadingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Pencil className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipInfo> */}

                <TooltipInfo content="Delete">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipInfo>

                <TooltipInfo content="Fund">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFundDialogOpen(true);
                    }}
                  >
                    <CircleDollarSign className="h-4 w-4" />
                  </Button>
                </TooltipInfo>
              </div>
            )}
            <div className="flex gap-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-xs italic">
                {payout.created_at.toLocaleDateString()}
              </span>
            </div>
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
