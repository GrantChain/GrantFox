import { useMemo } from "react";

export interface FundingData {
  month: string;
  funding: number;
}

export interface PayoutTypeData {
  name: string;
  value: number;
}

export interface PerformanceData {
  metric: string;
  A: number;
}

export interface DashboardStats {
  totalFunding: string;
  activeEscrows: string;
  completionRate: string;
}

export const useDashboardData = () => {
  // TODO: Replace with real API calls when backend is ready
  // Example:
  // const { data: fundingData } = useQuery(['funding-data'], fetchFundingData);
  // const { data: payoutData } = useQuery(['payout-data'], fetchPayoutData);
  // const { data: performanceData } = useQuery(['performance-data'], fetchPerformanceData);
  // const { data: statsData } = useQuery(['stats-data'], fetchStatsData);

  const fundingData = useMemo<FundingData[]>(
    () => [
      { month: "Jan", funding: 12000 },
      { month: "Feb", funding: 18000 },
      { month: "Mar", funding: 9000 },
    ],
    [],
  );

  const payoutTypeData = useMemo<PayoutTypeData[]>(
    () => [
      { name: "GRANT", value: 12 },
      { name: "BOUNTY", value: 8 },
      { name: "HACKATHON", value: 5 },
    ],
    [],
  );

  const performanceData = useMemo<PerformanceData[]>(
    () => [
      { metric: "Funding Speed", A: 80 },
      { metric: "Completion", A: 90 },
      { metric: "Trust", A: 70 },
    ],
    [],
  );

  const statsData = useMemo<DashboardStats>(
    () => ({
      totalFunding: "$193,200 USDC",
      activeEscrows: "25",
      completionRate: "83%",
    }),
    [],
  );

  return {
    fundingData,
    payoutTypeData,
    performanceData,
    statsData,
  };
};
