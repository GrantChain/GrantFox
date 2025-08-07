"use client";
import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface PayoutTypeData {
  name: string;
  value: number;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--destructive))",
];

interface DonutChartProps {
  data: PayoutTypeData[];
  className?: string;
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  ({ data, className, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="hsl(var(--muted-foreground))"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                `${name} Payouts`,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  },
);

DonutChart.displayName = "DonutChart";

export { DonutChart };
export type { DonutChartProps, PayoutTypeData };
