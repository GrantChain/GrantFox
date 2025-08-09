"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const MilestoneCardSkeleton = () => {
  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-2 w-full max-w-[70%]">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneCardSkeleton;
