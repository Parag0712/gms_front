"use client";

import React, { useEffect, useState } from "react";
import { useEditFlat } from "@/hooks/management/manage-flat";
import { useMeters } from "@/hooks/meter-managment/meter";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { Meter, Flat } from "@/types";
import { cn } from "@/lib/utils";

const flatEditSchema = z.object({
  flat_no: z
    .string()
    .min(1, "Flat number is required")
    .max(255, "Flat number must be at most 255 characters long"),
  floor_id: z
    .number()
    .int("Floor ID must be an integer")
    .positive("Floor ID must be a positive number"),
  meter_id: z
    .number()
    .int()
    .positive("Meter ID must be a positive number")
    .optional()
    .nullable(),
});

type FormInputs = z.infer<typeof flatEditSchema>;

const EditFlatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedFlat: Flat | null;
}> = ({ isOpen, onClose, onSuccess, selectedFlat }) => {
  const { mutate: editFlatMutation, isPending } = useEditFlat();
  const { data: metersResponse } = useMeters();
  const [meterOpen, setMeterOpen] = useState(false);
  const [selectedMeterId, setSelectedMeterId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(flatEditSchema),
    defaultValues: {
      flat_no: selectedFlat?.flat_no || "",
      meter_id: selectedFlat?.meter_id || null,
      floor_id: selectedFlat?.floor_id || 0,
    },
  });

  useEffect(() => {
    if (selectedFlat) {
      setValue("flat_no", selectedFlat.flat_no);
      setValue("meter_id", selectedFlat.meter_id);
      setValue("floor_id", selectedFlat.floor_id);
      setSelectedMeterId(selectedFlat.meter_id?.toString() || "");
    }
  }, [selectedFlat, setValue]);

  const allMeters = (metersResponse?.data || []) as Meter[];
  const unassignedMeters = allMeters.filter(
    (meter) => !meter.gmsFlat || meter.id === selectedFlat?.meter_id
  );

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedFlat) return;

    editFlatMutation(
      {
        flatId: selectedFlat.id,
        flatData: {
          flat_no: data.flat_no,
          floor_id: selectedFlat.floor_id,
          meter_id: selectedMeterId ? Number(selectedMeterId) : undefined,
        },
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            onClose();
            onSuccess();
            reset();
            setSelectedMeterId("");
          }
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Flat</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the flat information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flat_no" className="text-sm font-semibold">
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

          {/* Meter Combobox */}
          <div className="space-y-2">
            <Label htmlFor="meter" className="text-sm font-semibold">
              Select Meter (Optional)
            </Label>
            <Popover open={meterOpen} onOpenChange={setMeterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={meterOpen}
                  className="w-full justify-between"
                >
                  {selectedMeterId
                    ? unassignedMeters.find(
                        (meter) => meter.id.toString() === selectedMeterId
                      )?.meter_id
                    : "Select a meter..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search meter..." />
                  <CommandList>
                    <CommandEmpty>No unassigned meter found.</CommandEmpty>
                    <CommandGroup>
                      {unassignedMeters.map((meter) => (
                        <CommandItem
                          key={meter.id}
                          value={meter.meter_id}
                          onSelect={() => {
                            const newValue = meter.id.toString();
                            setSelectedMeterId(
                              newValue === selectedMeterId ? "" : newValue
                            );
                            setValue("meter_id", meter.id);
                            setMeterOpen(false);
                          }}
                          className="hover:bg-gray-100"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedMeterId === meter.id.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {meter.meter_id}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
