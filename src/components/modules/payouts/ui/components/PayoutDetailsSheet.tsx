import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import { Calendar, Wallet } from "lucide-react";
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
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <div className="relative h-72 w-full">
          {payout.image_url ? (
            <>
              <Image
                src={payout.image_url}
                alt={payout.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Wallet className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-primary/80">
                  No Image Available
                </h2>
              </div>
            </div>
          )}
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

        <div className="flex-1 p-6 space-y-8">
          <div className="flex justify-between items-center">
            <div className="text-end text-2xl font-bold">
              {formatCurrency(payout.currency, payout.total_funding)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {payout.description}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {/* {payout?.metrics.json()?.map((metric) => (
              <div key={metric.name}>
                <h3 className="text-lg font-semibold">{metric.name}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {metric.value}
                </p>
              </div>
            ))} */}
            <p>METRICS</p>
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created on {payout.created_at.toLocaleDateString()}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
