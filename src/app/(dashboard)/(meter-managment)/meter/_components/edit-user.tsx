"use client";

import React, { useEffect } from "react";
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
import { editGmsMeterSchema } from "@/schemas/meter-managment/meterschema";
import { z } from "zod";
import { MeterPayload, MeterStatus } from "@/types/index.d";
import { useEditMeter } from "@/hooks/meter-managment/meter";

type FormInputs = z.infer<typeof editGmsMeterSchema>;

interface EditMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedMeter: any | null;
  availableFlats: { id: number; flat_no: string }[];
}

const EditMeterModal: React.FC<EditMeterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedMeter,
  availableFlats,
}) => {
  const { mutate: editMeterMutation, isPending } = useEditMeter();

  const { register, handleSubmit, reset, control, formState: { errors }, setValue } = useForm<FormInputs>({
    resolver: zodResolver(editGmsMeterSchema),
  });

  useEffect(() => {
    if (selectedMeter) {
      setValue("meter_id", selectedMeter.meter_id);
      setValue("installation_at", selectedMeter.installation_at);
      setValue("flat_id", selectedMeter.gmsFlatId);
      setValue("status", selectedMeter.status);
    }
  }, [selectedMeter, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedMeter) return;

    editMeterMutation(
      { meterId: selectedMeter.id, meterData: data as Partial<MeterPayload> },
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
          <DialogTitle className="text-xl sm:text-2xl font-bold">Edit Meter</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Update the meter information below.
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
              <Label htmlFor="installation_at" className="text-xs sm:text-sm font-medium">
                Installation Date
              </Label>
              <Input
                id="installation_at"
                type="datetime-local"
                {...register("installation_at")}
                className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg"
              />
              {errors.installation_at && (
                <p className="text-red-500 text-xs mt-1">{errors.installation_at.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="flat_id" className="text-xs sm:text-sm font-medium">
                Flat
              </Label>
              <Controller
                name="flat_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <SelectTrigger className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg">
                      <SelectValue placeholder="Select a flat" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFlats.map((flat) => (
                        <SelectItem key={flat.id} value={flat.id.toString()}>
                          {flat.flat_no}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.flat_id && (
                <p className="text-red-500 text-xs mt-1">{errors.flat_id.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="status" className="text-xs sm:text-sm font-medium">
                Status
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

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

export default EditMeterModal;
