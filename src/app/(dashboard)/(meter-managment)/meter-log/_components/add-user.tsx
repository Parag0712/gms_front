"use client";

import React from "react";
import { useAddMeterLog } from "@/hooks/meter-managment/meter-log";
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
import { gmsMeterReadingLogSchema } from "@/schemas/meter-managment/meter-logschema";
import { z } from "zod";
import { ReadingStatus } from "@/types/index.d";

type FormInputs = z.infer<typeof gmsMeterReadingLogSchema>;

const formFields = [
  { name: "meter_id", label: "Meter ID", type: "number", placeholder: "Enter meter ID" },
  { name: "reading", label: "Reading", type: "number", placeholder: "Enter reading" },
  { name: "previous_reading", label: "Previous Reading", type: "number", placeholder: "Enter previous reading" },
  { name: "current_reading", label: "Current Reading", type: "number", placeholder: "Enter current reading" },
  { name: "units_consumed", label: "Units Consumed", type: "number", placeholder: "Enter units consumed" },
];

const AddMeterLogModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addMeterLogMutation, isPending } = useAddMeterLog();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(gmsMeterReadingLogSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    addMeterLogMutation(data, {
      onSuccess: (response) => {
        if (response.success) {
          onClose();
          onSuccess();
          reset();
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Add Meter Log</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to create a new meter log entry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-1 sm:space-y-2">
                <Label htmlFor={field.name} className="text-xs sm:text-sm font-medium">
                  {field.label} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                  {...register(field.name as keyof FormInputs)}
                />
                {errors[field.name as keyof FormInputs] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name as keyof FormInputs]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="status" className="text-xs sm:text-sm font-medium">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select {...register("status")}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ReadingStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto text-sm sm:text-base">
              {isPending ? "Adding..." : "Add Meter Log"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeterLogModal;