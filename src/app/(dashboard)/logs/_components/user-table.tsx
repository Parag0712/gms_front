"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { useGetLogs } from "@/hooks/users/manage-users";
import { Separator } from "@/components/ui/separator";

export type ActivityLog = {
  id: number;
  user_id: number | null;
  action: string;
  created_at: string;
  customer?: {
    app_registered_fee: boolean;
    approved_by: number;
    approved_time: string;
    created_at: string;
    disabled: boolean;
    email_address: string;
    first_name: string;
    last_name: string;
    login_ip: string;
    role: string;
    phone: string;
    id: number;
  };
};

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

  const { data: logsData, isLoading } = useGetLogs();
  const logs: ActivityLog[] = Array.isArray(logsData?.data)
    ? logsData.data
    : [];

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
        </div>
      </div>

      <div className="rounded-md">
        <DataTable
          columns={columns}
          data={logs}
          loading={isLoading}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </div>
  );
};

export default UserTable;
