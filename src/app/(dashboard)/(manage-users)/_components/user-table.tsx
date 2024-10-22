"use client";

import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "@/services/manage-users";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Reusing Input
import AddUserModal from "./add-user";
import EditUserModal from "./edit-user";
import { DataTable } from "./data-table"; // Moved table logic to the data-table component
import { columns } from "./columns"; // Importing columns from a separate file
import { User } from "next-auth";
import { PlusCircle } from "lucide-react";

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response?.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (user_id: number) => {
    try {
      await deleteUser(user_id);
      toast.success("User deleted successfully");
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.log(error);
      toast.error("Error deleting user");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <DataTable columns={columns} data={filteredUsers} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchUsers}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchUsers}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default UserTable;
