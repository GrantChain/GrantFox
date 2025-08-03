"use client";
import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface FundingData {
  month: string;
  funding: number;
}

interface OverviewChartProps {
  data: FundingData[];
  className?: string;
}

const OverviewChart = React.forwardRef<HTMLDivElement, OverviewChartProps>(
  ({ data, className, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar
              dataKey="funding"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  },
);

OverviewChart.displayName = "OverviewChart";

export { OverviewChart };
export type { OverviewChartProps, FundingData };
