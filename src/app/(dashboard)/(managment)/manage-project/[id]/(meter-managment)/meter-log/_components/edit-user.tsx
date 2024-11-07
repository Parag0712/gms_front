"use client";

import React, { useEffect } from "react";
import { useEditMeterLog } from "@/hooks/meter-managment/meter-log";
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
import { editGmsMeterReadingLogSchema } from "@/schemas/meter-managment/meter-logschema";
import { z } from "zod";
import { ReadingStatus } from "@/types/index.d";

type FormInputs = z.infer<typeof editGmsMeterReadingLogSchema>;

interface MeterLog {
  id: number;
  meter_id: number;
  current_reading: number;
  img_url?: string;
  status: ReadingStatus;
}

const EditMeterLogModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedMeterLog: MeterLog | null;
}> = ({ isOpen, onClose, onSuccess, selectedMeterLog }) => {
  const { mutate: editMeterLogMutation, isPending } = useEditMeterLog();
  const [imageFileName, setImageFileName] = React.useState<string>("");

  const { register, handleSubmit, reset, formState: { errors }, setValue, setError } = useForm<FormInputs>({
    resolver: zodResolver(editGmsMeterReadingLogSchema),
  });

  useEffect(() => {
    if (selectedMeterLog) {
      setValue("meter_id", selectedMeterLog.meter_id);
      setValue("current_reading", selectedMeterLog.current_reading);
      setValue("status", selectedMeterLog.status);

      if (selectedMeterLog.img_url) {
        const fileName = selectedMeterLog.img_url.split('/').pop() || '';
        setImageFileName(fileName);
      }
    }
  }, [selectedMeterLog, setValue]);

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

    setImageFileName(file.name);
    setValue("image", file, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedMeterLog) return;

    const formData = new FormData();
    if (data.meter_id) formData.append("meter_id", data.meter_id.toString());
    if (data.current_reading) formData.append("current_reading", data.current_reading.toString());
    if (data.status) formData.append("status", data.status);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    editMeterLogMutation(
      { meterLogId: selectedMeterLog.id, meterLogData: formData as any },
      {
        onSuccess: (response: any) => {
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
          <DialogTitle className="text-xl sm:text-2xl font-bold">Edit Meter Log</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Update the meter log information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="meter_id" className="text-xs sm:text-sm font-medium">
                Meter ID
              </Label>
              <Input
                id="meter_id"
                type="text"
                placeholder="Enter meter ID"
                {...register("meter_id")}
                className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg"
              />
              {errors.meter_id && (
                <p className="text-red-500 text-xs mt-1">{errors.meter_id.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="current_reading" className="text-xs sm:text-sm font-medium">
                Current Reading
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
                Meter Image <span className="text-xs text-gray-500">(Max 2MB)</span>
              </Label>
              <div className="relative">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg opacity-0 absolute"
                />
                <Input
                  readOnly
                  value={imageFileName || "Choose file..."}
                  className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg"
                />
              </div>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="status" className="text-xs sm:text-sm font-medium">
                Status
              </Label>
              <Select onValueChange={(value) => setValue("status", value as ReadingStatus)} defaultValue={selectedMeterLog?.status}>
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMeterLogModal;
