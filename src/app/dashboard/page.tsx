"use client";

import { StatsCard } from "@/components/cards/StatsCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { OverviewChart } from "@/components/charts/OverviewChart";
import { RadarChart } from "@/components/charts/RadarChart";
import { Banknote, CheckCircle, ShieldCheck } from "lucide-react";

const fundingData = [
  { month: "Jan", funding: 12000 },
  { month: "Feb", funding: 18000 },
  { month: "Mar", funding: 9000 },
];

const payoutTypeData = [
  { name: "GRANT", value: 12 },
  { name: "BOUNTY", value: 8 },
  { name: "HACKATHON", value: 5 },
];

const performanceData = [
  { metric: "Funding Speed", A: 80 },
  { metric: "Completion", A: 90 },
  { metric: "Trust", A: 70 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Funding"
          value="$193,200 USDC"
          icon={<Banknote className="h-4 w-4" />}
        />
        <StatsCard
          title="Escrows Active"
          value="25"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <StatsCard
          title="Completion Rate"
          value="83%"
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
}
