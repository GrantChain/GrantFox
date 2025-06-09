import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Payout } from "@/generated/prisma";
import { formatCurrency } from "@/utils/format.utils";
import { Calendar, TrendingUp } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface PayoutsCardProps {
  payout: Payout;
}

export function PayoutCard({ payout }: PayoutsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/50",
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/50",
    COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/50",
    CANCELLED: "bg-rose-500/10 text-rose-500 border-rose-500/50",
  };

  const statusGlow = {
    ACTIVE: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    PENDING: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    COMPLETED: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    CANCELLED: "shadow-[0_0_15px_rgba(244,63,94,0.3)]",
  };

  const statusColor =
    statusColors[payout.status as keyof typeof statusColors] ||
    statusColors.PENDING;
  const glowEffect = statusGlow[payout.status as keyof typeof statusGlow] || "";

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 border border-slate-200/20 backdrop-blur-sm ${
        isHovered ? glowEffect : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {payout.image_url && (
          <div className="h-32 w-full relative">
            <Image
              src={payout.image_url || "/placeholder.svg"}
              alt={payout.title}
              fill
              className="object-cover"
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
          <div className="flex items-center text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{payout.metrics}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl font-bold">
            {formatCurrency(payout.currency, payout.total_funding)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
