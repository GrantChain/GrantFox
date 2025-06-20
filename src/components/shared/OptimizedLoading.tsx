import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedLoadingProps {
  count?: number;
  className?: string;
}

export const OptimizedLoading = ({
  count = 3,
  className = "h-10 w-full",
}: OptimizedLoadingProps) => {
  return (
    <div className="animate-pulse space-y-4 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={className} />
      ))}
    </div>
  );
};
