import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { statusColors } from "../../utils/card.utils";
import { PayoutDetailsSheet } from "./PayoutDetailsSheet";

interface PayoutsCardProps {
  payout: Payout;
}

export function PayoutCard({ payout }: PayoutsCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const statusColor =
    statusColors[payout.status as keyof typeof statusColors] ||
    statusColors.PENDING;

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
          <h2 className="text-xl font-semibold mb-2 line-clamp-1">
            {payout.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {payout.description}
          </p>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{payout.created_at.toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-bold">
              {formatCurrency(payout.currency, payout.total_funding)}
            </div>
          </div>
        </CardContent>
      </Card>

      <PayoutDetailsSheet
        payout={payout}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  );
}
