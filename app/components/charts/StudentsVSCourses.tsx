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

// Updated chart data representing students and courses
const chartData = [
  { course: "CSE", students: 1200, fill: "var(--color-cse)" },
  { course: "EEE", students: 950, fill: "var(--color-eee)" },
  { course: "MAT", students: 800, fill: "var(--color-mat)" },
  { course: "BBA", students: 650, fill: "var(--color-bba)" },
  { course: "LAW", students: 400, fill: "var(--color-law)" },
];

const chartConfig = {
  students: {
    label: "Students",
  },
  cse: {
    label: "CSE",
    color: "hsl(var(--chart-1))",
  },
  eee: {
    label: "Electrical Engineering",
    color: "hsl(var(--chart-2))",
  },
  mat: {
    label: "Mechanical Engineering",
    color: "hsl(var(--chart-3))",
  },
  bba: {
    label: "Civil Engineering",
    color: "hsl(var(--chart-4))",
  },
  law: {
    label: "LAW",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const StudentsVSCourses = () => {
  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Students vs Courses</CardTitle>
        <CardDescription>Total Students per Course</CardDescription>
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
              nameKey="course"
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
          Distribution of students across different courses.
        </div>
        <div className="text-muted-foreground">
          A total of {totalStudents.toLocaleString()} students are currently
          enrolled.
        </div>
      </CardFooter>
    </Card>
  );
};

export default StudentsVSCourses;
