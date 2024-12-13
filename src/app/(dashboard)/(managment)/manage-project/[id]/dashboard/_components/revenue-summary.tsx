"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, IndianRupee, Loader2 } from "lucide-react";
import { RevenueChart } from "./revenue-chart";
import { useRevenueYearly, useRevenueMonthly } from "@/hooks/revenue/revenue";
// import { useParams } from "next/navigation";
import { MonthPicker } from "./MonthPicker";
import { YearPicker } from "./YearPicker";
import { RevenueRange } from "@/types/index.d";

export default function RevenueSummary() {
  // const params = useParams();
  const [selectedRange, setSelectedRange] = useState<RevenueRange>(
    RevenueRange.Yearly
  );
  const [revenue, setRevenue] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<string | null>("2024");
  // const projectId = Number(params.id);
  const [loading, setLoading] = useState(false);

  // Fetch yearly revenue for the selected year
  const { data: yearlyRevenue } = useRevenueYearly(
    selectedRange === RevenueRange.Yearly && year ? parseInt(year) : 0,
    1
  );
  console.log("yearlyRevenue", yearlyRevenue);
  // Fetch monthly revenue for the selected year and month
  const { data: monthlyRevenue } = useRevenueMonthly(
    selectedRange === RevenueRange.Monthly && year && month
      ? parseInt(year)
      : 0,
    month ? month : 0,
    1
  );
  console.log("monthlyRevenue", monthlyRevenue);

  // Fetch total revenue
  // const { data: totalRevenue } = useRevenueTotal(
  //   selectedRange === RevenueRange.Total ? 1 : 0
  // );

  const handleSelectChange = (value: RevenueRange) => {
    setSelectedRange(value);
    setMonth(null);
    setYear("2024");
  };

  const applyCustomFilter = () => {
    if (
      year &&
      (selectedRange === RevenueRange.Yearly ||
        (selectedRange === RevenueRange.Monthly && month))
    ) {
      fetchRevenueData();
    }
  };

  const fetchRevenueData = useCallback(async () => {
    setLoading(true);
    try {
      if (
        selectedRange === RevenueRange.Yearly &&
        Array.isArray(yearlyRevenue?.data)
      ) {
        setRevenue(yearlyRevenue.data[0]?.revenue || 0);
      } else if (
        selectedRange === RevenueRange.Monthly &&
        Array.isArray(monthlyRevenue?.data)
      ) {
        setRevenue(monthlyRevenue.data[0]?.revenue || 0);
      }
      // } else if (
      //   selectedRange === RevenueRange.Total &&
      //   Array.isArray(totalRevenue?.data)
      // ) {
      //   setRevenue(totalRevenue.data[0]?.revenue || 0);
      // }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setRevenue(0);
    } finally {
      setLoading(false);
    }
  }, [yearlyRevenue, monthlyRevenue, selectedRange]);

  useEffect(() => {
    if (selectedRange === RevenueRange.Yearly && year) {
      fetchRevenueData();
    }
  }, [fetchRevenueData, selectedRange, year]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="rounded-lg flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary">
          <CreditCard />
          <h1 className="text-xl font-bold">Revenue Summary</h1>
        </div>

        <div>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={selectedRange} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RevenueRange).map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="my-5">
        <h1 className="font-bold">Revenue Summary from {selectedRange}</h1>
      </div>

      {selectedRange === RevenueRange.Yearly && (
        <div className="mb-5">
          <YearPicker value={year} onChange={setYear} />
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={applyCustomFilter}
            disabled={!year}
          >
            Apply Filter
          </button>
        </div>
      )}

      {selectedRange === RevenueRange.Monthly && (
        <div className="mb-5">
          <div className="flex gap-4">
            <YearPicker value={year} onChange={setYear} />
            <MonthPicker value={month} onChange={setMonth} />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={applyCustomFilter}
            disabled={!year || !month}
          >
            Apply Filter
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <IndianRupee />
          <div className="ml-4">
            <h2 className="text-sm font-semibold text-gray-500">Collection</h2>
            <p className="text-sm font-bold text-black text-end">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : revenue !== null ? (
                `₹${revenue}`
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-2 md:col-span-3 lg:col-span-2 bg-white shadow-md p-4 rounded-lg mt-2">
        <h2 className="text-lg font-semibold mb-4">
          {selectedRange} Consumption
        </h2>
        <p className="text-xs">{selectedRange}</p>
        <RevenueChart selectedRange={selectedRange} revenue={revenue} />
      </div>
    </div>
  );
}
