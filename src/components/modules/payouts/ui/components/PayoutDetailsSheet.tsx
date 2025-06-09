import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { statusColors } from "../../utils/card.utils";

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
    statusColors.PENDING;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
        {payout.image_url && (
          <div className="relative h-72 w-full">
            <Image
              src={payout.image_url}
              alt={payout.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-start justify-between">
                <SheetTitle className="text-2xl font-bold text-white drop-shadow-lg">
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
        )}

        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created on {payout.created_at.toLocaleDateString()}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {payout.description}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Funding</h3>
              <div className="text-3xl font-bold">
                {formatCurrency(payout.currency, payout.total_funding)}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
