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

type FormInputs = z.infer<typeof gmsMeterSchema>;

interface AddMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableFlats: { id: number; flat_no: string }[];
}

const AddMeterModal: React.FC<AddMeterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  availableFlats,
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
  } = useForm<FormInputs>({
    resolver: zodResolver(gmsMeterSchema),
    defaultValues: {
      status: MeterStatus.ACTIVE,
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("meter_id", data.meter_id);
      formData.append("installation_at", data.installation_at);
      formData.append("status", data.status);

      if (data.image instanceof File) {
        formData.append("image", data.image); // Append image if it's a valid file
      }

      console.log("FormData to be sent:", Array.from(formData.entries())); // Debugging output

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

    // Set the image file directly in the form
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="meter_id"
                className="text-xs sm:text-sm font-medium"
              >
                Meter ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="meter_id"
                type="text"
                placeholder="Enter meter ID"
                {...register("meter_id")}
                className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg"
              />
              {errors.meter_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.meter_id.message}
                </p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="installation_at"
                className="text-xs sm:text-sm font-medium"
              >
                Installation Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="installation_at"
                type="date"
                {...register("installation_at")}
                className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg"
              />
              {errors.installation_at && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.installation_at.message}
                </p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="image" className="text-xs sm:text-sm font-medium">
                Meter Image{" "}
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="status"
                className="text-xs sm:text-sm font-medium"
              >
                Status <span className="text-red-500">*</span>
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
                    <SelectTrigger className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MeterStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.status.message}
                </p>
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
              {isPending ? "Adding..." : "Add Meter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeterModal;
