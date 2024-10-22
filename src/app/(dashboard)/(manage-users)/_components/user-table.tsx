"use client";

import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "@/services/manage-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { User } from "next-auth";
import { PlusCircle } from "lucide-react";
import EditUserModal from "./edit-user";
import AddUserModal from "./add-user";
import toast from "react-hot-toast";

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
    const response = await getAllUsers();
    if (response.success) {
      setUsers(response.data as User[]);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (user_id: number) => {
    const response = await deleteUser(user_id);
    console.log(response);
    if (response.success) {
      toast.success(response.message);
      fetchUsers();
    } else {
      toast.error(response.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <DataTable
        columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
        data={filteredUsers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchUsers}
      />

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
