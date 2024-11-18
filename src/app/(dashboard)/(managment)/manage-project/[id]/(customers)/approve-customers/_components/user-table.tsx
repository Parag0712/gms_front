"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Customer } from "@/types/index.d";
import { useFilteredCustomers } from "@/hooks/customers/manage-customers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const UserTable = () => {
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  // React Query hooks
  const {
    data: usersResponse,
    isLoading,
    error
  } = useFilteredCustomers(projectId);

  // Get users array from the response
  const customers = usersResponse?.data as Customer[] || [];

  // Filter users based on search term, role, and approval status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = Object.values(customer)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || customer.role === roleFilter;
    const matchesApproval =
      approvalFilter === "all" ||
      (approvalFilter === "approved" && customer.approved_by !== null) ||
      (approvalFilter === "notApproved" && customer.approved_by === null);
    return matchesSearch && matchesRole && matchesApproval;
  });

  return (
    <div className="space-y-4">
      {/* Search, Role Filter, and Approval Filter section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 border"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm py-2 px-4 rounded-lg focus:ring-primary focus:border-primary"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="OWNER">Owner</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
            </SelectContent>
          </Select>
          <Select value={approvalFilter} onValueChange={setApprovalFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by approval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="notApproved">Not Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns()}
          data={filteredCustomers}
          loading={isLoading}
          error={error as Error}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default UserTable;