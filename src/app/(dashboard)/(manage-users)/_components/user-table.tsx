"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { User } from "next-auth";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import UserDetails from "./details";
import { useUsers, useDeleteUser } from "@/hooks/users/manage-users";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

// Dynamically imported components
const AddUserModal = dynamic(() => import("./add-user"), {
  loading: () => <p>Loading Add User Modal...</p>,
  ssr: false,
});

const EditUserModal = dynamic(() => import("./edit-user"), {
  loading: () => <p>Loading Edit User Modal...</p>,
  ssr: false,
});

// Extend User type to include additional fields needed for details
interface ExtendedUser extends User {
  created_at: string;
  last_login: string;
}

const UserTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const toast = useCustomToast();
  const { data: session } = useSession();

  // React Query hooks
  const { data: usersResponse, isLoading, refetch: refetchUsers } = useUsers();

  const { mutate: deleteUserMutation } = useDeleteUser();

  // Handler for viewing user details
  const handleViewDetails = (user: User) => {
    setSelectedUser(user as ExtendedUser);
    setIsDetailsModalOpen(true);
  };

  // Handler for editing a user
  const handleEdit = (user: User) => {
    setSelectedUser(user as ExtendedUser);
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
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    refetchUsers();
    handleModalClose();
  };

  // Filter users based on search term, role, and session user
  const filteredUsers = React.useMemo(() => {
    if (!usersResponse?.data || !session?.user?.id) return [];

    return Array.isArray(usersResponse.data)
      ? usersResponse.data
          .filter((user: ExtendedUser) => user.id !== session.user.id)
          .filter((user: ExtendedUser) => {
            const matchesSearch = Object.values(user)
              .join(" ")
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const matchesRole =
              roleFilter === "all" || user.role === roleFilter;
            return matchesSearch && matchesRole;
          })
      : [];
  }, [usersResponse?.data, session?.user?.id, searchTerm, roleFilter]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          View and manage all users in the system
        </p>
      </div>
      <Separator />

      {/* Search, Role Filter, and Add User section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
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
              <SelectItem value="MASTER">Master</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="AGENT">Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add User
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
      {isAddModalOpen && (
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          selectedUser={selectedUser}
        />
      )}

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
