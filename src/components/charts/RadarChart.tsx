"use client";
import * as React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface PerformanceData {
  metric: string;
  A: number;
}

interface RadarChartProps {
  data: PerformanceData[];
  className?: string;
}

const RadarChartComponent = React.forwardRef<HTMLDivElement, RadarChartProps>(
  ({ data, className, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="hsl(var(--muted-foreground))" />
            <PolarAngleAxis
              dataKey="metric"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Radar
              name="Performance"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  },
);

RadarChartComponent.displayName = "RadarChart";

export { RadarChartComponent as RadarChart };
export type { RadarChartProps, PerformanceData };
