import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PayoutCardSkeleton() {
  return (
    <Card className="w-full max-w-sm shadow-sm overflow-hidden">
      <div className="relative w-full h-40 overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-4 w-14" />
            </div>

            <div className="text-right space-y-1">
              <Skeleton className="h-6 w-24 ml-auto" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>
        </div>

        <Skeleton className="h-4 w-full" />

        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <div className="text-xs">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-16 mt-1" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-8 w-28 md:w-32 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
