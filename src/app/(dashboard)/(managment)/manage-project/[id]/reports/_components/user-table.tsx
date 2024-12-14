// ReportsTable.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateReportService } from "@/services/generate-report/generate-report";
import { Report } from "@/types/index.d";

const ReportsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // React Query hook for fetching reports
  const {
    data: reports = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await generateReportService.getAllReports({});
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reports");
      }
      return response.data || [];
    },
  });

  const filteredReports = Array.isArray(reports)
    ? reports.filter((report: Report) => {
        const matchesSearch =
          report.report_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.id.toString().includes(searchTerm);

        const matchesType =
          selectedType === "all" ||
          report.report_type.toLowerCase() === selectedType.toLowerCase();

        return matchesSearch && matchesType;
      })
    : [];

  const types = Array.isArray(reports)
    ? [
        "all",
        ...Array.from(
          new Set(reports.map((report: Report) => report.report_type))
        ),
      ]
    : [];

  const capitalizeFirstLetter = (str: string) => {
    return str && str.length > 0
      ? str
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : str;
  };

  if (error instanceof Error) {
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[300px]"
          />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {capitalizeFirstLetter(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md">
        <DataTable
          columns={columns}
          data={filteredReports}
          loading={isLoading}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </div>
  );
};

export default ReportsTable;
