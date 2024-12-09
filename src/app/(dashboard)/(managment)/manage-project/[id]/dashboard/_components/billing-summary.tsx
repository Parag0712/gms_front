"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, IndianRupee, Clock4 } from "lucide-react";
import { BillingChart } from "./BillingChart";

// Importing the chart component

export default function BillingSummary() {
  const [selectedRange, setSelectedRange] = useState("Today");
  const handleSelectChange = (value: string) => {
    setSelectedRange(value);
    console.log("Selected Range:", value);
  };

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
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Yesterday">Yesterday</SelectItem>
                <SelectItem value="Last Seven Days">Last Seven Days</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
                <SelectItem value="Three Months">Three Months</SelectItem>
                <SelectItem value="Six Months">Six Months</SelectItem>
                <SelectItem value="Last Year">Last Year</SelectItem>
                <SelectItem value="Custom Range">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="my-5">
          <h1 className="font-bold">Billing Summary from {selectedRange}</h1>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 md:col-span-3 lg:col-span-2 bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            {selectedRange} Consumption
          </h2>
          <div>
            <BillingChart selectedRange={selectedRange} />
          </div>
        </div>

        <div className="col-span-1  flex flex-col gap-6">
          <div className="bg-white shadow-md p-4 rounded-lg flex justify-between">
            <CreditCard />
            <div>
              <h2 className="text-lg font-semibold">Invoice Amount</h2>
              <p className="text-sm font-bold text-gray-700 text-end">
                ₹75,940
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md p-4 rounded-lg flex justify-between">
            <IndianRupee />
            <div>
              <h2 className="text-lg font-semibold">Collection</h2>
              <p className="text-sm font-bold text-gray-700 text-end">
                ₹63,329
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md p-4 rounded-lg flex justify-between">
            <Clock4 />
            <div>
              <h2 className="text-lg font-semibold">Pending</h2>
              <p className="text-sm font-bold text-gray-700 text-end">
                ₹12,611
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
