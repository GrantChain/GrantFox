"use client";

import { StatsCard } from "@/components/cards/StatsCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { OverviewChart } from "@/components/charts/OverviewChart";
import { RadarChart } from "@/components/charts/RadarChart";
import { Banknote, CheckCircle, ShieldCheck } from "lucide-react";
import { useDashboardData } from "./hooks/useDashboardData";

export const Dashboard = () => {
  const { fundingData, payoutTypeData, performanceData, statsData } =
    useDashboardData();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Funding"
          value={statsData.totalFunding}
          icon={<Banknote className="h-4 w-4" />}
        />
        <StatsCard
          title="Escrows Active"
          value={statsData.activeEscrows}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <StatsCard
          title="Completion Rate"
          value={statsData.completionRate}
          icon={<CheckCircle className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Funding Overview</h3>
            <OverviewChart data={fundingData} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Payout Types</h3>
            <DonutChart data={payoutTypeData} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <RadarChart data={performanceData} />
      </div>
    </div>
  );
};
