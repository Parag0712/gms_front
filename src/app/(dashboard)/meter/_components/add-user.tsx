"use client";

import React from "react";
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
import { gmsMeterSchema } from "@/schemas/meter-managment/meterschema";
import { z } from "zod";
import { MeterPayload, MeterStatus } from "@/types/index.d";
import { useAddMeter } from "@/hooks/meter-managment/meter";
import { Switch } from "@/components/ui/switch";

type FormInputs = z.infer<typeof gmsMeterSchema>;

interface AddMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMeterModal: React.FC<AddMeterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { mutate: addMeterMutation, isPending } = useAddMeter();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<FormInputs>({
    resolver: zodResolver(gmsMeterSchema),
    defaultValues: {
      status: MeterStatus.ACTIVE,
      isExisting: "false",
    },
  });

  const isExisting = watch("isExisting") === "true";

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("meter_id", data.meter_id);
      formData.append("installation_at", data.installation_at);
      formData.append("status", data.status);
      formData.append("isExisting", data.isExisting);

      if (data.isExisting === "true" && data.old_meter_reading) {
        formData.append("old_meter_reading", String(data.old_meter_reading));
      }

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      addMeterMutation(formData as unknown as MeterPayload, {
        onSuccess: (response) => {
          if (response.success) {
            onClose();
            onSuccess();
            reset();
          }
        },
        onError: (error) => {
          console.error("Error adding meter:", error);
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
            Add Meter
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to add a new meter.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Meter ID Field */}
            <div className="space-y-2">
              <Label htmlFor="meter_id" className="text-sm font-semibold">
                Meter ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="meter_id"
                type="text"
                placeholder="Enter meter identification number"
                {...register("meter_id")}
                className="w-full h-10"
              />
              {errors.meter_id && (
                <p className="text-red-500 text-xs">{errors.meter_id.message}</p>
              )}
            </div>

            {/* Installation Date Field */}
            <div className="space-y-2">
              <Label htmlFor="installation_at" className="text-sm font-semibold">
                Installation Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="installation_at"
                type="date"
                {...register("installation_at")}
                className="w-full h-10"
              />
              {errors.installation_at && (
                <p className="text-red-500 text-xs">
                  {errors.installation_at.message}
                </p>
              )}
            </div>

            {/* Meter Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-semibold">
                Meter Image (Optional) <span className="text-gray-500 text-xs ml-2">(Max: 2MB)</span>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full h-10 cursor-pointer"
              />
              {errors.image && (
                <p className="text-red-500 text-xs">{errors.image.message}</p>
              )}
            </div>

            {/* Meter Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold">
                Meter Status <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="status"
                control={control}
                defaultValue={MeterStatus.ACTIVE}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select meter status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MeterStatus).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-xs">{errors.status.message}</p>
              )}
            </div>

            {/* Existing Meter Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isExisting" className="text-sm font-semibold">
                  Existing Meter
                </Label>
                <Controller
                  name="isExisting"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value === "true"}
                      onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                    />
                  )}
                />
              </div>
            </div>

            {/* Old Meter Reading Field - Only shown when isExisting is true */}
            {isExisting && (
              <div className="space-y-2">
                <Label htmlFor="old_meter_reading" className="text-sm font-semibold">
                  Old Meter Reading
                </Label>
                <Input
                  id="old_meter_reading"
                  type="number"
                  placeholder="Enter old meter reading"
                  {...register("old_meter_reading", { valueAsNumber: true })}
                  className="w-full h-10"
                />
                {errors.old_meter_reading && (
                  <p className="text-red-500 text-xs">{errors.old_meter_reading.message}</p>
                )}
              </div>
            )}
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
              {isPending ? "Adding Meter..." : "Add Meter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeterModal;
