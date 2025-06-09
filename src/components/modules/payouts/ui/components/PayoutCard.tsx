import { useUser } from "@/components/modules/auth/context/UserContext";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { statusColors } from "../../utils/card.utils";
import { PayoutDetailsSheet } from "./PayoutDetailsSheet";
import { PayoutFormModal } from "./PayoutFormModal";

interface PayoutsCardProps {
  payout: Payout;
}

export function PayoutCard({ payout }: PayoutsCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useUser();

  const statusColor =
    statusColors[payout.status as keyof typeof statusColors] ||
    statusColors.PENDING;

  const handleDelete = () => {
    // TODO: Implement delete functionality
    setIsDeleteDialogOpen(false);
  };

  const handleEditPayout = (data: any) => {
    // TODO: Implement edit functionality
    console.log("Edit payout:", data);
    setShowEditModal(false);
  };

  return (
    <>
      <Card
        className="cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        onClick={() => setIsSheetOpen(true)}
      >
        <div className="relative">
          {payout.image_url && (
            <div className="h-32 w-full relative overflow-hidden">
              <Image
                src={payout.image_url || "/placeholder.svg"}
                alt={payout.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          <Badge
            className={`absolute top-2 right-2 ${statusColor}`}
            variant="outline"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditModal(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
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
      />

      <PayoutFormModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSubmit={handleEditPayout}
        mode="edit"
      />
    </>
  );
}
