"use client";

import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "@/lib/apiService"; // Use the API functions you provided
import toast from "react-hot-toast"; // React hot toast for notifications
import { Button } from "@/components/ui/button"; // Button component from ShadCN
import AddUserModal from "./add-user"; // Add User Modal
import EditUserModal from "./edit-user"; // Edit User Modal
import { User } from "next-auth";

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch all users when the component loads
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response?.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
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
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add User</Button>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.first_name}</td>
                <td className="border p-2">{user.last_name}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">{user.email_address}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <Button onClick={() => handleEdit(user)}>Edit</Button>
                  <Button
                    onClick={() => handleDelete(Number(user.id))}
                    className="ml-2"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchUsers} // Refresh the user list after success
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchUsers} // Refresh the user list after success
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default UserTable;
