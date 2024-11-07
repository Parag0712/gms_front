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
import { ReadingStatus, Meter } from "@/types/index.d";
import { useMeters } from "@/hooks/meter-managment/meter";

type FormInputs = z.infer<typeof gmsMeterReadingLogSchema>;

const AddMeterLogModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addMeterLogMutation, isPending } = useAddMeterLog();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(gmsMeterReadingLogSchema),
    defaultValues: {
      status: ReadingStatus.VALID,
    },
  });

  const { data: metersResponse } = useMeters();
  const meters = (metersResponse?.data || []) as Meter[];

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

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("meter_id", data.meter_id.toString());
      formData.append("current_reading", data.current_reading.toString());
      formData.append("status", data.status);

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      addMeterLogMutation(formData as any, {
        onSuccess: (response) => {
          if (response.success) {
            onClose();
            onSuccess();
            reset();
          }
        },
      });
    } catch (error) {
      console.error("Error in form submission:", error);
    }
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
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="meter_id" className="text-xs sm:text-sm font-medium">
                Select Meter <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("meter_id", parseInt(value))}>
                <SelectTrigger className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg">
                  <SelectValue placeholder="Select a meter" />
                </SelectTrigger>
                <SelectContent>
                  {meters.map((meter: Meter) => (
                    <SelectItem key={meter.id} value={meter.id.toString()}>
                      {meter.meter_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.meter_id && (
                <p className="text-red-500 text-xs mt-1">{errors.meter_id.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="current_reading" className="text-xs sm:text-sm font-medium">
                Current Reading <span className="text-red-500">*</span>
              </Label>
              <Input
                id="current_reading"
                type="text"
                placeholder="Enter current reading"
                {...register("current_reading")}
                className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg"
              />
              {errors.current_reading && (
                <p className="text-red-500 text-xs mt-1">{errors.current_reading.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="image" className="text-xs sm:text-sm font-medium">
                Meter Image <span className="text-red-500">*</span>{" "}
                <span className="text-xs text-gray-500">(Max 2MB)</span>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg"
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="status" className="text-xs sm:text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("status", value as ReadingStatus)}>
                <SelectTrigger className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg">
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
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {isPending ? "Adding..." : "Add Meter Log"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeterLogModal;