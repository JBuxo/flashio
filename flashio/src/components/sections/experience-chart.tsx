"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "User Experience Chart";

const chartData = [{ experience: 200, fill: "var(--color-experience)" }];

const chartConfig = {
  experience: {
    label: "Experience",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ExperienceChart() {
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto min-w-full min-h-fit"
      >
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={250}
          innerRadius={87}
          outerRadius={150}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[100, 74]}
          />
          <RadialBar dataKey="experience" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {chartData[0].experience.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        XP
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <div className="bg-accent mt-4 p-4 rounded-xl text-center">
        <strong>100</strong> more PassPoints to level up
      </div>
    </>
  );
}
