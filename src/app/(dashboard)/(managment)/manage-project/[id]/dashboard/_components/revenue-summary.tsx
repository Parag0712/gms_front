"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Loader2,
  TrendingUp,
  ArrowUpRight,
  ArrowLeft,
  Download,
  Upload,
} from "lucide-react";
import { RevenueChart } from "./revenue-chart";
import { useRevenueYearly, useRevenueMonthly } from "@/hooks/revenue/revenue";
import { MonthPicker } from "./MonthPicker";
import { YearPicker } from "./YearPicker";
import { RazorpayInvoice, RevenueRange } from "@/types/index.d";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { useImportData } from "@/hooks/import-data/import-data";
import { CustomRangeRevenue } from "./custom-range-revenue";
import { Input } from "@/components/ui/input";
interface YearlyRevenue {
  year: number;
  revenue: number;
}
interface importDataPayload {
  file: File;
  projectId: string;
}
// interface YearlyRevenueData {
//   data: {
//     yearlyRevenues: YearlyRevenue[];
//   };
// }
export default function RevenueSummary() {
  const [selectedRange, setSelectedRange] = useState<RevenueRange | "Custom">(
    RevenueRange.Yearly
  );
  const [revenue, setRevenue] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<string | null>("2024");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  const { mutate: importData, isUploading } = useImportData();

  const { data: yearlyRevenue, isLoading: isYearlyLoading } = useRevenueYearly(
    selectedRange === RevenueRange.Yearly && year ? parseInt(year) : 0,
    projectId
  );

  const { data: monthlyRevenue, isLoading: isMonthlyLoading } =
    useRevenueMonthly(
      selectedRange === RevenueRange.Monthly && year && month
        ? parseInt(year)
        : 0,
      month ? month : 0,
      projectId
    );

  const handleSelectChange = (value: RevenueRange | "Custom") => {
    setSelectedRange(value);
    setMonth(null);
    setYear("2024");
  };

  const handleDownloadFormat = () => {
    const link = document.createElement("a");
    link.href = "/Without Wing Format.csv";
    link.download = "revenue_format.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId.toString());
    const payload: importDataPayload = {
      file,
      projectId: projectId.toString(),
    };
    importData(payload);
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
        Array.isArray(yearlyRevenue?.data?.yearlyRevenues)
      ) {
        const matchingYear = yearlyRevenue.data.yearlyRevenues.find(
          (item: YearlyRevenue) => item.year === parseInt(year || "0")
        );
        setRevenue(matchingYear?.revenue || 0);
      } else if (
        selectedRange === RevenueRange.Monthly &&
        Array.isArray(monthlyRevenue?.data)
      ) {
        const matchingMonth = monthlyRevenue.data.find(
          (item: RazorpayInvoice) => item.month === (month as number).toString()
        );
        setRevenue(matchingMonth?.revenue || 0);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setRevenue(0);
    } finally {
      setLoading(false);
    }
  }, [yearlyRevenue, monthlyRevenue, selectedRange, year, month]);

  useEffect(() => {
    if (
      (!isYearlyLoading && yearlyRevenue) ||
      (!isMonthlyLoading && monthlyRevenue)
    ) {
      fetchRevenueData();
    }
  }, [
    fetchRevenueData,
    isYearlyLoading,
    isMonthlyLoading,
    yearlyRevenue,
    monthlyRevenue,
  ]);

  const isDataLoading = loading || isYearlyLoading || isMonthlyLoading;

  return (
    <div className="min-h-screen p-2 bg-gradient-to-br from-background to-background/80">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground font-medium">Back</span>
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadFormat}
            className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Download className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">
              Download Format
            </span>
          </Button>

          <div className="relative">
            <Input
              type="file"
              id="file-upload"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-muted-foreground font-medium">
                {isUploading ? "Uploading..." : "Upload File"}
              </span>
            </Button>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Revenue Summary
              </h1>
              <p className="text-muted-foreground">
                Track your financial performance
              </p>
            </div>
          </div>

          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur">
              <SelectValue placeholder={selectedRange} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RevenueRange).map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="col-span-1 p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <h2 className="text-3xl font-bold mt-2">
                  {isDataLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `₹${(revenue || 0).toLocaleString()}`
                  )}
                </h2>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="text-muted-foreground">
                vs last {selectedRange.toLowerCase()}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6">
          {selectedRange === RevenueRange.Yearly && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 items-end"
            >
              <YearPicker value={year} onChange={setYear} />
              <button
                onClick={applyCustomFilter}
                disabled={!year}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Apply Filter
              </button>
            </motion.div>
          )}

          {selectedRange === RevenueRange.Monthly && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 items-end"
            >
              <YearPicker value={year} onChange={setYear} />
              <MonthPicker value={month} onChange={setMonth} />
              <button
                onClick={applyCustomFilter}
                disabled={!year || !month}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Apply Filter
              </button>
            </motion.div>
          )}

          {selectedRange === "Custom" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full"
            >
              <CustomRangeRevenue />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {selectedRange} Revenue Trend
              </h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Revenue</span>
                </div>
              </div>
            </div>
            <RevenueChart selectedRange={selectedRange} revenue={revenue} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
