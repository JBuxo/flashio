"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Experience breakdown by day";

const chartData = Array.from({ length: 7 }, (_, i) => ({
  day: i + 1,
  experience: Math.floor(Math.random() * 500) + 50,
}));

const chartConfig = {
  experience: {
    label: "Experience",
    color: "var(--accent)",
  },
} satisfies ChartConfig;

export function ExperienceChart() {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 32,
        }}
      >
        {/* <CartesianGrid vertical={false} /> */}
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillExperience" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="60%"
              stopColor="var(--color-experience)"
              stopOpacity={0.8}
            />
            <stop
              offset="100%"
              stopColor="var(--color-experience)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>

        <Area
          dataKey="experience"
          type="natural"
          fill="url(#fillExperience)"
          fillOpacity={0.4}
          stroke="var(--color-experience)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
