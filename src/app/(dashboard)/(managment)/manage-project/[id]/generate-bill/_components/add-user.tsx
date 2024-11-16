"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAddBill } from "@/hooks/generate-bill/generate-bill";
import { useFilteredCustomers } from "@/hooks/customers/manage-customers";
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
import { z } from "zod";

const billCreateSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  current_reading: z.number().min(0, "Current reading must be positive"),
  image: z.any().optional(),
});

type FormInputs = z.infer<typeof billCreateSchema>;

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddInvoiceModal: React.FC<AddBillModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const params = useParams();
  const projectId = Number(params.id);
  const { mutate: addBillMutation, isPending } = useAddBill();
  const { data: customersData } = useFilteredCustomers(projectId);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setError,
    setValue,
  } = useForm<FormInputs>({
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setValue("image", file, { shouldValidate: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Generate Bill
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to generate a new bill.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customer Selection */}
            <div className="space-y-2">
              <Label htmlFor="customerId" className="text-sm font-semibold">
                Customer <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="customerId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(customersData?.data) &&
                        customersData.data.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            {customer.first_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.customerId && (
                <p className="text-red-500 text-xs">{errors.customerId.message}</p>
              )}
            </div>

            {/* Current Reading */}
            <div className="space-y-2">
              <Label htmlFor="current_reading" className="text-sm font-semibold">
                Current Reading <span className="text-red-500">*</span>
              </Label>
              <Input
                id="current_reading"
                type="number"
                placeholder="Enter current meter reading"
                {...register("current_reading", { valueAsNumber: true })}
                className="w-full h-10"
              />
              {errors.current_reading && (
                <p className="text-red-500 text-xs">
                  {errors.current_reading.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-semibold">
                Meter Image
                <span className="text-gray-500 text-xs ml-2">(Max: 2MB)</span>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full h-10 cursor-pointer"
              />
              {errors.image && (
                <p className="text-red-500 text-xs">{errors.image.message?.toString()}</p>
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
              {isPending ? "Generating Bill..." : "Generate Bill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceModal;