import React, { useMemo } from "react";
import { Pie, PieChart, Label } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 🎨 Generate random HSL color
const generateRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

// 🧾 Attendance category data
const rawData = [
  { category: "Excellent", students: 500 },
  { category: "Good", students: 800 },
  { category: "Average", students: 600 },
  { category: "Poor", students: 300 },
];

const AttendanceDistribution: React.FC = () => {
  // 🎯 Add random fill color to each item
  const chartData = useMemo(() => {
    return rawData.map((item) => ({
      ...item,
      fill: generateRandomColor(),
    }));
  }, []);

  // 🧠 Build chartConfig dynamically
  const chartConfig: ChartConfig = useMemo(() => {
    return chartData.reduce((acc, curr) => {
      acc[curr.category.toLowerCase()] = {
        label: curr.category,
        color: curr.fill,
      };
      return acc;
    }, {} as ChartConfig);
  }, [chartData]);

  const totalStudents = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0);
  }, [chartData]);

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
