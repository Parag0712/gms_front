"use client";

import React, { useEffect } from "react";
import { useEditUser } from "@/hooks/users/manage-users";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userEditSchema } from "@/schemas/users/editusersschema";
import { z } from "zod";
import { User } from "next-auth";

// Define the shape of our form inputs based on the schema
type FormInputs = z.infer<typeof userEditSchema>;

// Define form fields for easy mapping and reusability
const formFields = [
  { name: "first_name", label: "First Name", type: "text", placeholder: "Enter first name" },
  { name: "last_name", label: "Last Name", type: "text", placeholder: "Enter last name" },
  { name: "email_address", label: "Email", type: "email", placeholder: "Enter email address" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Enter phone number" },
];

// Available roles for the select input
const roles = ["MASTER", "ADMIN", "AGENT"] as const;

// EditUserModal component for editing users
const EditUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedUser: User | null;
}> = ({ isOpen, onClose, onSuccess, selectedUser }) => {
  const { mutate: editUserMutation, isPending } = useEditUser();

  // Initialize form handling with react-hook-form and zod resolver
  const { register, handleSubmit, reset, control, formState: { errors }, setValue } = useForm<FormInputs>({
    resolver: zodResolver(userEditSchema),
  });

  // Update form values when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setValue("first_name", selectedUser.first_name || "");
      setValue("last_name", selectedUser.last_name || "");
      setValue("email_address", selectedUser.email_address || "");
      setValue("phone", selectedUser.phone || "");
      setValue("role", selectedUser.role as "MASTER" | "ADMIN" | "AGENT" | undefined);
    }
  }, [selectedUser, setValue]);

  // Handle form submission
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedUser) return;

    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== "")
    ) as Required<Omit<FormInputs, "password">>;

    editUserMutation(
      { userId: selectedUser.id, userData: updatedData },
      {
        onSuccess: (response) => {
          if (response.success) {
            onClose();
            onSuccess();
            reset();
          }
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Edit User</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to edit this user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Grid layout for form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-1 sm:space-y-2">
                <Label htmlFor={field.name} className="text-xs sm:text-sm font-medium">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                  {...register(field.name as keyof FormInputs)}
                />
                {/* Display error message if field validation fails */}
                {errors[field.name as keyof FormInputs] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name as keyof FormInputs]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Role selection dropdown */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="role" className="text-xs sm:text-sm font-medium">
              Role
            </Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {/* Display error message if role is not selected */}
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Form action buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto text-sm sm:text-base">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
