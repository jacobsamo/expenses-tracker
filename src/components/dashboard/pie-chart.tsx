"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Expense } from "@/types";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

const chartConfig = {
  fuel: {
    label: "Fuel",
  },
  groceries: {
    label: "Groceries",
    color: "hsl(var(--chart-1))",
  },
  food: {
    label: "Food",
    color: "hsl(var(--chart-2))",
  },
  activities: {
    label: "Activities",
    color: "hsl(var(--chart-3))",
  },
  accommodation: {
    label: "Accommodation",
    color: "hsl(var(--chart-4))",
  },
  "going-out": {
    label: "Going Out",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export interface DisplayPieChartProps {
  expenses: Expense[];
  chartTitle: string;
  chartDescription?: string;
}

export function DisplayPieChart({
  expenses,
  chartTitle,
  chartDescription,
}: DisplayPieChartProps) {
  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{chartTitle}</CardTitle>
        {chartDescription && (
          <CardDescription>{chartDescription}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={expenses}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalExpenses.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Amount
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
