import { useEffect, useState } from "react";
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
import { axiosClient } from "~/lib/apiClient";

// Generate random color for each department
const generateRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

const TeacherVsDepartment = () => {
  const [chartData, setChartData] = useState<
    { department: string; teachers: number; fill: string }[]
  >([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  // Fetch data from the API
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axiosClient.get(
          "/department/departmentsVsTeachers"
        );

        const data: Array<{
          department: string;
          code: string;
          teachers: number;
        }> = response.data.data;

        // Format data with dynamic colors
        const formattedData: Array<{
          department: string;
          code: string;
          teachers: number;
          fill: string;
        }> = data.map((item) => ({
          ...item,
          fill: generateRandomColor(),
        }));

        setChartData(formattedData);

        // Create dynamic chartConfig based on data
        const config = formattedData.reduce((acc, curr) => {
          acc[curr.code] = {
            label: curr.code,
            color: curr.fill,
          };
          return acc;
        }, {} as ChartConfig);

        setChartConfig(config);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments vs Teachers</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="code"
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
          <span>Teacher distribution across departments</span>
        </div>
        <div className="leading-none text-muted-foreground">
          Showing teacher distribution for the first half of 2024.
        </div>
      </CardFooter>
    </Card>
  );
};

export default TeacherVsDepartment;
