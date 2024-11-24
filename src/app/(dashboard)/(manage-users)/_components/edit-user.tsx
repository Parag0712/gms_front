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

type FormInputs = z.infer<typeof userEditSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedUser: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedUser,
}) => {
  const { mutate: editUserMutation, isPending } = useEditUser();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue
  } = useForm<FormInputs>({
    resolver: zodResolver(userEditSchema),
  });

  useEffect(() => {
    if (selectedUser) {
      setValue("first_name", selectedUser.first_name || "");
      setValue("last_name", selectedUser.last_name || "");
      setValue("email_address", selectedUser.email_address || "");
      setValue("phone", selectedUser.phone || "");
      setValue("role", selectedUser.role as "MASTER" | "ADMIN" | "AGENT" | undefined);
    }
  }, [selectedUser, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedUser) return;

    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        console.log(`Processing field: ${key}`);
        return value !== undefined && value !== "";
      })
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

  const formFields = [
    {
      id: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
    },
    {
      id: "last_name",
      label: "Last Name", 
      type: "text",
      placeholder: "Enter last name",
    },
    {
      id: "email_address",
      label: "Email",
      type: "email", 
      placeholder: "Enter email address",
    },
    {
      id: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "Enter phone number",
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Edit User
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to edit this user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-semibold">
                  {field.label} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.id as keyof FormInputs)}
                  className="w-full h-10"
                />
                {errors[field.id as keyof FormInputs] && (
                  <p className="text-red-500 text-xs">
                    {errors[field.id as keyof FormInputs]?.message}
                  </p>
                )}
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold">
                Role <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {["MASTER", "ADMIN", "AGENT"].map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-xs">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 bg-primary"
            >
              {isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
