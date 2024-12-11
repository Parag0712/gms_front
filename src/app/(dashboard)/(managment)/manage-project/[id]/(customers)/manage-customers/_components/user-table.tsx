// components/user-table.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Customer } from "@/types/index.d";
import { PlusCircle, ArrowLeft } from "lucide-react";
import EditUserModal from "./edit-user";
import AddUserModal from "./add-user";
import { useFilteredCustomers, useDeleteCustomer, useSendPasswordReset } from "@/hooks/customers/manage-customers";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useParams } from "next/navigation";

const UserTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const toast = useCustomToast();
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  // React Query hooks
  const {
    data: usersResponse,
    isLoading,
    refetch: refetchCustomers
  } = useFilteredCustomers(projectId);

  const { mutate: deleteCustomerMutation } = useDeleteCustomer();
  const { mutate: sendPasswordResetMutation } = useSendPasswordReset();

  // Handler for editing a user
  const handleEdit = (user: Customer) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handler for deleting a user
  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteCustomerMutation(userId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchCustomers();
            toast.success({ message: "Customer deleted successfully" });
          }
        },
      });
    }
  };

  // Handler for sending password reset
  const handleSendPasswordReset = (email: string) => {
    sendPasswordResetMutation(email);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    refetchCustomers();
    handleModalClose();
  };

  // Get users array from the response
  const customers = usersResponse?.data as Customer[] || [];

  // Filter users based on search term and role
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = Object.values(customer)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || customer.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {/* Search, Role Filter, and Add User section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
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
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* User Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete, onSendPasswordReset: handleSendPasswordReset })}
          data={filteredCustomers}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default UserTable;