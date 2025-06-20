import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { authService } from "@/components/modules/auth/services/auth.service";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import { Calendar, Loader2, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePayoutMutations } from "../../hooks/usePayoutMutations";
import type { PayoutFormValues } from "../../schemas/payout.schema";
import { statusColors } from "../../utils/card.utils";
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
  const { handleDeletePayout, isDeleting } = usePayoutMutations();
  const [granteeEmail, setGranteeEmail] = useState<string>("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  useEffect(() => {
    const fetchGranteeEmail = async () => {
      if (payout.grantee_id) {
        setIsLoadingEmail(true);
        try {
          const result = await authService.getUserById(payout.grantee_id);
          if (result.exists && result.user) {
            setGranteeEmail(result.user.email);
          }
        } catch (error) {
          console.error("Error fetching grantee email:", error);
        } finally {
          setIsLoadingEmail(false);
        }
      }
    };
    fetchGranteeEmail();
  }, [payout.grantee_id]);

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

  const initialValues: Partial<PayoutFormValues> = {
    title: payout.title,
    description: payout.description,
    type: payout.type,
    status: payout.status,
    total_funding: Number(payout.total_funding),
    currency: payout.currency,
    image_url: payout.image_url || "",
    grantee_id: granteeEmail,
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
            className={`absolute top-2 right-2 ${statusColors[payout.status]} hover:${statusColors[payout.status]}`}
          >
            {payout.status}
          </Badge>
        </div>

        <CardContent className="p-5">
          <div className="md:flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                {payout.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {payout.description}
              </p>
            </div>

            <div className="text-2xl font-bold truncate">
              {formatCurrency(payout.currency, payout.total_funding)}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            {user?.role === "PAYOUT_PROVIDER" && (
              <div className="flex gap-2">
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
    </>
  );
}
