"use client";

import React from "react";
import { useAddBill } from "@/hooks/generate-bill/generate-bill";
import { useCustomers } from "@/hooks/customers/manage-customers";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { z } from "zod";

// Define schema for bill generation
const billCreateSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  current_reading: z.number().min(0, "Current reading must be positive"),
  image: z.any().optional(),
});

// Define the shape of our form inputs based on the schema
type FormInputs = z.infer<typeof billCreateSchema>;

// Define form fields for easy mapping and reusability
const formFields = [
  { name: "current_reading", label: "Current Reading", type: "number", placeholder: "Enter current meter reading" },
  { name: "image", label: "Meter Image (Max 2MB)", type: "file", placeholder: "Upload meter reading image", accept: "image/*" },
];

// AddBillModal component for generating new bills
const AddBillModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addBillMutation, isPending } = useAddBill();
  const { data: customersData } = useCustomers();

  const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(billCreateSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("customerId", data.customerId);
      formData.append("current_reading", data.current_reading.toString());

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      addBillMutation(formData as any, {
        onSuccess: (response) => {
          if (response.success) {
            onClose();
            onSuccess();
            reset();
          }
        },
        onError: (error) => {
          console.error("Error generating bill:", error);
        },
      });
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB limit
    if (file.size > maxSize) {
      setError("image", {
        type: "manual",
        message: "Image size must be less than 2MB",
      });
      e.target.value = "";
      return;
    }

    // Set the image file directly in the form
    setValue("image", file, { shouldValidate: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Generate Bill</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to generate a new bill.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Grid layout for form fields */}
          <div className="grid grid-cols-1 gap-4">
            {/* Customer Select Dropdown */}
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="customerId" className="text-xs sm:text-sm font-medium">
                Customer <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue('customerId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(customersData?.data) && customersData.data.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.first_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerId.message}
                </p>
              )}
            </div>

            {/* Other form fields */}
            {formFields.map((field) => (
              <div key={field.name} className="space-y-1 sm:space-y-2">
                <Label htmlFor={field.name} className="text-xs sm:text-sm font-medium">
                  {field.label} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  accept={field.accept}
                  className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                  {...register(field.name as keyof FormInputs, {
                    valueAsNumber: field.type === 'number',
                    onChange: field.type === 'file' ? handleFileChange : undefined
                  })}
                />
                {/* Display error message if field validation fails */}
                {errors[field.name as keyof FormInputs] && (
                  <p className="text-red-500 text-xs mt-1">
                    {String(errors[field.name as keyof FormInputs]?.message)}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Form action buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto text-sm sm:text-base">
              {isPending ? "Generating..." : "Generate Bill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBillModal;