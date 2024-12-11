"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, IndianRupee } from "lucide-react";
import { BillingChart } from "./billing-chart";
import { useRevenueYearly } from "@/hooks/revenue/revenue";

export default function BillingSummary() {
  const [selectedRange, setSelectedRange] = useState("Yearly");
  const [revenue, setRevenue] = useState<number | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [triggerYearly, setTriggerYearly] = useState(false);
  // const [triggerMonthly, setTriggerMonthly] = useState(false);

  // Mock project ID
  // const projectId = 2;

  // Handle the select change event
  const handleSelectChange = (value: string) => {
    setSelectedRange(value);
    setMonth(null);
    setYear(null);
    setTriggerYearly(false);
    // setTriggerMonthly(false);
  };

  // Handle year input change
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(e.target.value);
  };

  // Handle month input change
  // const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setMonth(e.target.value);
  // };

  const { data: yearlyRevenue } = useRevenueYearly(
    triggerYearly && year ? parseInt(year) : 2023,
    1
  );
  const applyCustomFilter = () => {
    if (selectedRange === "Yearly" && year) {
      setTriggerYearly(true);
      // setTriggerMonthly(false);
    } else if (selectedRange === "Monthly" && year && month) {
      // setTriggerMonthly(true);
      setTriggerYearly(false);
    }
  };

  // Fetch yearly revenue when triggerYearly is true

  // Fetch monthly revenue when triggerMonthly is true
  // const { data: monthlyRevenue, isLoading: isMonthlyLoading } =
  //   useRevenueMonthly(
  //     triggerMonthly && year && month ? parseInt(year) : undefined,
  //     triggerMonthly && month ? parseInt(month) : undefined,
  //     1
  //   );

  useEffect(() => {
    if (
      triggerYearly &&
      Array.isArray(yearlyRevenue?.data) &&
      yearlyRevenue.data.length > 0
    ) {
      setRevenue(yearlyRevenue.data[0].revenue || 0);
      setTriggerYearly(false); // Reset the trigger
    }
  }, [yearlyRevenue, triggerYearly]);

  useEffect(() => {
    if (!year) {
      setYear("2024");
    }
  }, [year]);
  useEffect(() => {
    if (
      triggerYearly &&
      yearlyRevenue?.data &&
      Array.isArray(yearlyRevenue.data) &&
      yearlyRevenue.data.length > 0
    ) {
      setRevenue(yearlyRevenue.data[0].revenue || 0);
      setTriggerYearly(false);
    }
  }, [yearlyRevenue, triggerYearly]);

  useEffect(() => {
    console.log("Revenue after update:", revenue);
  }, [revenue]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div>
        <div className="rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
            <CreditCard />
            <h1 className="text-xl font-bold">Billing Summary</h1>
          </div>

          <div>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={selectedRange} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yearly">Yearly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Custom Range">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="my-5">
          <h1 className="font-bold">Billing Summary from {selectedRange}</h1>
        </div>

        {selectedRange === "Yearly" && (
          <div className="mb-5">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Year
                </label>
                <input
                  type="number"
                  value={year || ""}
                  onChange={handleYearChange}
                  min="2020"
                  max="2024"
                  placeholder="YYYY"
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={applyCustomFilter}
              disabled={!year}
            >
              Apply Filter
            </button>
          </div>
        )}

        {/* {selectedRange === "Monthly" && (
          <div className="mb-5">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Year
                </label>
                <input
                  type="number"
                  value={year || ""}
                  onChange={handleYearChange}
                  min="1900"
                  max="2100"
                  placeholder="YYYY"
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Month
                </label>
                <input
                  type="number"
                  value={month || ""}
                  onChange={handleMonthChange}
                  min="1"
                  max="12"
                  placeholder="MM"
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={applyCustomFilter}
              disabled={!year || !month}
            >
              Apply Filter
            </button>
          </div>
        )} */}
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
            <IndianRupee />
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-500">
                Collection
              </h2>
              <p className="text-sm font-bold text-black text-end">
                ₹{revenue}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-3 lg:col-span-2 bg-white shadow-md p-4 rounded-lg mt-2">
          <h2 className="text-lg font-semibold mb-4">
            {selectedRange} Consumption
          </h2>
          <div>
            <BillingChart selectedRange={selectedRange} revenue={revenue} />
          </div>
        </div>
      </div>
    </div>
  );
}
