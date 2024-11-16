// components/user-table.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { User } from "next-auth";
import { PlusCircle } from "lucide-react";
import EditUserModal from "./edit-user";
import AddUserModal from "./add-user";
import { useUsers, useDeleteUser } from "@/hooks/users/manage-users";
import { useCustomToast } from "@/components/providers/toaster-provider";

const UserTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useCustomToast();

  // React Query hooks
  const {
    data: usersResponse,
    isLoading,
    refetch: refetchUsers
  } = useUsers();
  console.log(usersResponse)

  const { mutate: deleteUserMutation } = useDeleteUser();

  // Handler for editing a user
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handler for deleting a user
  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation(userId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchUsers();
            toast.success({ message: "User deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    refetchUsers();
    handleModalClose();
  };

  // Get users array from the response and filter for agents by default
  const users = (usersResponse?.data as User[] || []).filter(user => user.role === "AGENT");
  

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const matchesSearch = Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search and Add User section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm py-2 px-4 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* User Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={filteredUsers}
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