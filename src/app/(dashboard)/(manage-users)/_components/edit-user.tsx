"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { editUser } from "@/lib/apiService"; // API call
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components from ShadCN
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { User } from "next-auth";

const EditUserModal = ({
  isOpen,
  onClose,
  onSuccess,
  selectedUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedUser: User | null;
}) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    phone: 0,
    role: "agent",
  });

  useEffect(() => {
    if (selectedUser) {
      setForm({
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        email_address: selectedUser.email_address || "",
        phone: selectedUser.phone || 0,
        role: selectedUser.role || "agent",
      });
    }
  }, [selectedUser, isOpen]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        // Edit user flow
        await editUser(
          selectedUser.id,
          form.first_name,
          form.last_name,
          form.email_address,
          form.phone,
          form.role
        );
        toast.success("User updated successfully");
        onClose();
        onSuccess(); // Refresh list after action
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Fill out the form below to edit this user.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="input w-full"
          />
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="input w-full"
          />
          <input
            type="email"
            name="email_address"
            value={form.email_address}
            onChange={handleChange}
            placeholder="Email"
            className="input w-full"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input w-full"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="master_admin">Master Admin</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>

          <div className="flex justify-end space-x-2">
            <Button onClick={handleSubmit} className="mr-2">
              Save
            </Button>
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
