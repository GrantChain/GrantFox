import { Suspense } from "react";
import { PayoutCardSkeleton } from "../components/PayoutCardSkeleton";
import { PayoutsSection } from "../components/PayoutsSection";

// Generate stable keys for skeleton components
const skeletonKeys = Array.from(
  { length: 6 },
  (_, index) => `suspense-skeleton-${index}-${Date.now()}`,
);

const PayoutsSkeleton = () => (
  <div className="flex flex-col h-full">
    <div className="mb-6 h-12 bg-muted rounded-lg animate-pulse" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
      {skeletonKeys.map((key) => (
        <PayoutCardSkeleton key={key} />
      ))}
    </div>
  </div>
);

export const Payouts = () => {
  return (
    <Suspense fallback={<PayoutsSkeleton />}>
      <PayoutsSection />
    </Suspense>
  );
};
