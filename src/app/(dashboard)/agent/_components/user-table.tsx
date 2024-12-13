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
import { Separator } from "@/components/ui/separator";
import UserDetails from "./details";

interface ExtendedUser extends User {
  created_at: string;
  last_login: string;
}

const UserTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Details modal state
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useCustomToast();

  const { data: usersResponse, isLoading, refetch: refetchUsers } = useUsers();
  const { mutate: deleteUserMutation } = useDeleteUser();

  const handleViewDetails = (user: User) => {
    setSelectedUser(user as ExtendedUser); // Cast to ExtendedUser
    setIsDetailsModalOpen(true); // Open details modal
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user as ExtendedUser);
    setIsEditModalOpen(true);
  };

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
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    refetchUsers();
    handleModalClose();
  };

  const users = ((usersResponse?.data as User[]) || []).filter(
    (user) => user.role === "AGENT"
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch = Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Agent Management</h2>
        <p className="text-muted-foreground">
          Manage your agents and their wallet balances here
        </p>
      </div>

      <Separator />

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
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Wallet Balance
        </Button>
      </div>

      {/* User Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
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

      {/* User Details Modal */}
      <UserDetails
        isOpen={isDetailsModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
      />
    </div>
  );
};

export default UserTable;
