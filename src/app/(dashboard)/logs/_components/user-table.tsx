"use client";

import React, { useState } from "react";
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
import { useGetLogs } from "@/hooks/users/manage-users";
import { Separator } from "@/components/ui/separator";

export type UserLog = {
  id: number;
  timestamp: string;
  category: string;
  method: string;
  email: string | null;
  role: string | null;
  userId: number | null;
  statusCode: number;
};

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: logsData, isLoading } = useGetLogs();
  const logs: UserLog[] = Array.isArray(logsData?.data) ? logsData.data : [];
  console.log("logs", logs);

  const filteredLogs = logs.filter((log: UserLog) => {
    const matchesSearch = Object.values(log)
      .map((value) =>
        value !== null && value !== undefined ? String(value).toLowerCase() : ""
      )
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      log.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Fix for Set iteration: Convert Set to Array using Array.from()
  const categories = [
    "all",
    ...Array.from(new Set(logs.map((log) => log.category).filter(Boolean))),
  ];

  const capitalizeFirstLetter = (str: string) => {
    return str && str.length > 0
      ? str.charAt(0).toUpperCase() + str.slice(1)
      : str;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Logs History</h2>
        <p className="text-muted-foreground">
          View and manage user logs history
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[300px]"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {capitalizeFirstLetter(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md">
        <DataTable
          columns={columns}
          data={filteredLogs}
          loading={isLoading}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </div>
  );
};

export default UserTable;
