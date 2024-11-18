"use client";

import React, { useEffect } from "react";
import { useEditFlat } from "@/hooks/management/manage-flat";
import { useMeters } from "@/hooks/meter-managment/meter";
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
import { Meter } from "@/types/index.d";

const flatEditSchema = z.object({
  flat_no: z.string().min(1, "Flat number is required"),
  address: z.string().min(1, "Address is required"),
  meter_id: z.number().min(1, "Meter is required")
});

type FormInputs = z.infer<typeof flatEditSchema>;

interface Flat {
  id: number;
  flat_no: string;
  floor_id: number;
  address: string;
  meter_id: number;
}

const EditFlatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedFlat: Flat | null;
}> = ({ isOpen, onClose, onSuccess, selectedFlat }) => {
  const { mutate: editFlatMutation, isPending } = useEditFlat();
  const { data: metersResponse } = useMeters();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(flatEditSchema),
  });

  useEffect(() => {
    if (selectedFlat) {
      setValue("flat_no", selectedFlat.flat_no);
      setValue("address", selectedFlat.address);
      setValue("meter_id", selectedFlat.meter_id);
    }
  }, [selectedFlat, setValue]);

  const meters = (metersResponse?.data || []) as Meter[];

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedFlat) return;

    editFlatMutation(
      {
        flatId: selectedFlat.id,
        flatData: {
          flat_no: data.flat_no,
          floor_id: selectedFlat.floor_id,
          address: data.address,
          meter_id: data.meter_id
        },
      },
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Flat</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the flat information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flat_no" className="text-sm font-medium">
              Flat Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="flat_no"
              placeholder="Enter flat number"
              className="w-full"
              {...register("flat_no")}
            />
            {errors.flat_no && (
              <p className="text-red-500 text-xs">{errors.flat_no.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="Enter address"
              className="w-full"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          {/* Meter Selection */}
          <div className="space-y-2">
            <Label htmlFor="meter">Select Meter</Label>
            <Select
              onValueChange={(value) => setValue("meter_id", Number(value))}
              defaultValue={selectedFlat?.meter_id?.toString()}
            >
              <SelectTrigger>
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
              <p className="text-red-500 text-xs">{errors.meter_id.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFlatModal;
