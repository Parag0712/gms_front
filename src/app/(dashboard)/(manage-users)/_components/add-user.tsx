"use client";

import React, { useState, ChangeEvent } from "react";
import { addUser } from "@/services/manage-users"; // API call
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components from ShadCN
import { Button } from "@/components/ui/button"; // ShadCN Button component

const AddUserModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    password: "",
    phone: "",
    role: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      console.log(form);
      // Add user flow
      await addUser(
        form.first_name,
        form.last_name,
        form.email_address,
        form.password,
        form.phone,
        form.role
      );
      toast.success("User added successfully");
      onClose();
      onSuccess(); // Refresh list after action
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Error saving user");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new user.
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
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
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
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="MASTER, ADMIN, AGENT"
            className="input w-full"
          />
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

export default AddUserModal;
