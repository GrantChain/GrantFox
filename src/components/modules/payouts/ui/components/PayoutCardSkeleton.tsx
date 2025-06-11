import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PayoutCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="relative">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="absolute top-2 right-2 h-5 w-16 rounded-full" />
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-center">
          <div className="flex flex-col flex-1 pr-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
