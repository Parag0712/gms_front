"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the type for the props
interface BillingChartProps {
  selectedRange: string;
  billingAmount: number;
  collection: number;
  pending: number;
}

interface ChartConfig {
  desktop: {
    label: string;
    color: string;
  };
  mobile: {
    label: string;
    color: string;
  };
  label: {
    color: string;
  };
}

export const BillingChart: React.FC<BillingChartProps> = ({
  selectedRange,
  billingAmount,
  collection,
  pending,
}) => {
  const chartConfig: ChartConfig = {
    desktop: {
      label: "Desktop View",
      color: "#000000",
    },
    mobile: {
      label: "Mobile View",
      color: "#FFFFFF",
    },
    label: {
      color: "#FF0000",
    },
  };

  const chartData = [
    {
      month: selectedRange,
      billingAmount: billingAmount, // Use the billingAmount prop
      collection: collection,
      pending: pending,
    },
  ];

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between">
        <p className="text-xs">{selectedRange}</p>
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <span className="bg-blue-500 w-2 h-2 rounded-full"></span>
            <p className="text-xs">Billing Amount</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-black w-2 h-2 rounded-full"></span>
            <p className="text-xs">Collections</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-green-500 w-2 h-2 rounded-full"></span>
            <p className="text-xs">Pending</p>
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig}>
        <ResponsiveContainer
          width="100%"
          height={200}
          className="!focus:outline-none"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            className="!focus:outline-none"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              className="text-xs"
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {/* Bar for Billing Amount */}
            <Bar
              dataKey="billingAmount"
              fill="rgb(59, 130, 246)"
              name="Billing Amount"
              radius={4}
              barSize={100}
            >
              <LabelList
                dataKey="billingAmount"
                position="insideTop"
                offset={8}
                fill="#fff"
                className="font-bold"
                fontSize={14}
                formatter={(value: number) => `₹${value.toLocaleString()}`}
              />
            </Bar>
            {/* Bar for Collection */}
            <Bar
              dataKey="collection"
              fill="rgb(0, 0, 0)"
              name="Collection"
              radius={4}
              barSize={100}
            >
              <LabelList
                dataKey="collection"
                position="insideTop"
                offset={8}
                fill="#fff"
                className="font-bold"
                fontSize={14}
                formatter={(value: number) => `₹${value.toLocaleString()}`}
              />
            </Bar>
            {/* Bar for Pending */}
            <Bar
              dataKey="pending"
              fill="rgb(34, 197, 94)"
              name="Pending"
              radius={4}
              barSize={100}
            >
              <LabelList
                dataKey="pending"
                position="insideTop"
                offset={8}
                fill="#fff"
                className="font-bold"
                fontSize={14}
                formatter={(value: number) => `₹${value.toLocaleString()}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
