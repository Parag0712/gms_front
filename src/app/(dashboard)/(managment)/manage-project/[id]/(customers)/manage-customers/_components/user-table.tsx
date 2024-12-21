// components/user-table.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Customer } from "@/types/index.d";
import { PlusCircle, ArrowLeft, Download, Upload, Loader2 } from "lucide-react";
import EditUserModal from "./edit-user";
import AddUserModal from "./add-user";
import {
  useFilteredCustomers,
  useDeleteCustomer,
  useSendPasswordReset,
} from "@/hooks/customers/manage-customers";
// import { useImportData } from "@/hooks/import-data/import-data";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useParams } from "next/navigation";
import { useImportCustomer } from "@/hooks/customers/import-customers";

const UserTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isUploading, setIsUploading] = useState(false);

  const toast = useCustomToast();
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  // React Query hooks
  const {
    data: usersResponse,
    isLoading,
    refetch: refetchCustomers,
  } = useFilteredCustomers(projectId);
  const { mutate: deleteCustomerMutation } = useDeleteCustomer();
  const { mutate: sendPasswordResetMutation } = useSendPasswordReset();
  const { mutate: importData } = useImportCustomer();
  console.log(importData);
  // Handlers
  const handleEdit = (user: Customer) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const payload = { file, projectId: projectId.toString() };
    setIsUploading(true);

    importData(payload, {
      onSuccess: () => {
        toast.success({ message: "File uploaded successfully" });
        refetchCustomers();
        setIsUploading(false);

        // Reset the file input field
        event.target.value = "";
      },
      onError: (error) => {
        // Use the error object to display a message or log it
        console.error("File upload error:", error);
        toast.error({
          message: error.message || "File upload failed. Please try again.",
        });

        setIsUploading(false);
        event.target.value = "";
      },
    });
  };

  const handleDownloadFormat = () => {
    const link = document.createElement("a");
    link.href = "/Without Customer Format.csv";
    link.download = "customer.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const customers = (usersResponse?.data as Customer[]) || [];
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
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* User Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onSendPasswordReset: handleSendPasswordReset,
          })}
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
