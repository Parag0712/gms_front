"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

interface BillingChartProps {
  selectedRange: string;
  revenue: number | null;
}

export const RevenueChart: React.FC<BillingChartProps> = ({
  selectedRange,
  revenue,
}) => {
  const chartData = [
    {
      month: selectedRange,
      revenue: revenue || 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            className="text-xs text-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            className="text-xs text-muted-foreground"
            tickFormatter={(value) => `₹${value.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="p-2 bg-background/80 backdrop-blur border border-border rounded-lg shadow-lg">
                    <p className="text-sm font-medium">{`₹${payload[0].value?.toLocaleString()}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="revenue"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            barSize={60}
          >
            <LabelList
              dataKey="revenue"
              position="top"
              className="fill-foreground font-medium"
              formatter={(value: number) => `₹${value.toLocaleString()}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

