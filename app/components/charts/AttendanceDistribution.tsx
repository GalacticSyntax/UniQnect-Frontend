import React from "react";
import { Pie, PieChart, Label } from "recharts";
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

// Updated chart data representing attendance distribution
const chartData = [
  { category: "Excellent", students: 500, fill: "var(--color-excellent)" },
  { category: "Good", students: 800, fill: "var(--color-good)" },
  { category: "Average", students: 600, fill: "var(--color-average)" },
  { category: "Poor", students: 300, fill: "var(--color-poor)" },
];

const chartConfig = {
  students: {
    label: "Students",
  },
  excellent: {
    label: "Excellent (90-100%)",
    color: "hsl(var(--chart-1))",
  },
  good: {
    label: "Good (75-89%)",
    color: "hsl(var(--chart-2))",
  },
  average: {
    label: "Average (50-74%)",
    color: "hsl(var(--chart-3))",
  },
  poor: {
    label: "Poor (<50%)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const AttendanceDistribution = () => {
  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Attendance Distribution</CardTitle>
        <CardDescription>Student Attendance Categories</CardDescription>
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
              data={chartData}
              dataKey="students"
              nameKey="category"
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
                          {totalStudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Students
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="font-medium leading-none">
          Breakdown of student attendance levels.
        </div>
        <div className="text-muted-foreground">
          A total of {totalStudents.toLocaleString()} students are categorized
          by their attendance percentage.
        </div>
      </CardFooter>
    </Card>
  );
};

export default AttendanceDistribution;
