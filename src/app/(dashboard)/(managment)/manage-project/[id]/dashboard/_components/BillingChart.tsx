"use client";

import { TrendingUp } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Example chart data for "Today"
const chartConfig = {
  billingAmount: {
    label: "Billing Amount",
    color: "blue-500",
  },
  collection: {
    label: "Collection",
    color: "black",
  },
  pending: {
    label: "Pending",
    color: "green-500",
  },
} satisfies ChartConfig;

export function BillingChart({ selectedRange }) {
  const chartData = [
    {
      month: selectedRange,
      billingAmount: 75940,
      collection: 64489,
      pending: 11451,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription>{selectedRange}</CardDescription>
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
      </CardHeader>

      <CardContent>
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
                barSize={100} //adjust bar width
              >
                {/* Label for Billing Amount with ₹ */}
                <LabelList
                  dataKey="billingAmount"
                  position="insideTop"
                  offset={8}
                  fill="#fff"
                  className="font-bold"
                  fontSize={14}
                  formatter={(value) => `₹${value.toLocaleString()}`}
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
                {/* Label for Collection with ₹ */}
                <LabelList
                  dataKey="collection"
                  position="insideTop"
                  offset={8}
                  fill="#fff"
                  className="font-bold"
                  fontSize={14}
                  formatter={(value) => `₹${value.toLocaleString()}`}
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
                {/* Label for Pending with ₹ */}
                <LabelList
                  dataKey="pending"
                  position="insideTop"
                  offset={8}
                  fill="#fff"
                  className="font-bold"
                  fontSize={14}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
