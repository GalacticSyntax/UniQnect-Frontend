import React from "react";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

// Updated chart data representing teachers and departments
const chartData = [
  { department: "CSE", teachers: 35, fill: "var(--color-cse)" },
  { department: "EEE", teachers: 28, fill: "var(--color-eee)" },
  { department: "BBA", teachers: 25, fill: "var(--color-bba)" },
  { department: "MAT", teachers: 22, fill: "var(--color-mat)" },
  { department: "LAW", teachers: 18, fill: "var(--color-law)" },
];

const chartConfig = {
  teachers: {
    label: "Teachers",
  },
  cse: {
    label: "CSE",
    color: "hsl(var(--chart-1))",
  },
  eee: {
    label: "EEE",
    color: "hsl(var(--chart-2))",
  },
  bba: {
    label: "BBA",
    color: "hsl(var(--chart-3))",
  },
  mat: {
    label: "MAT",
    color: "hsl(var(--chart-4))",
  },
  law: {
    label: "LAW",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const TeacherCountChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teachers vs Department</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="department"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value.toLowerCase() as keyof typeof chartConfig]
                  ?.label || value
              }
            />
            <XAxis dataKey="teachers" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="teachers" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <span>Teachers distribution in different departments</span>
        </div>
        <div className="leading-none text-muted-foreground">
          Showing teacher distribution for the first half of 2024.
        </div>
      </CardFooter>
    </Card>
  );
};

export default TeacherCountChart;
