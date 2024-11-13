"use client";

import React, { useState } from "react";
import { useAddFlat } from "@/hooks/management/manage-flat";
import { useFilteredTowers } from "@/hooks/management/manage-tower";
import { useWings } from "@/hooks/management/manage-wing";
import { useFloors } from "@/hooks/management/manage-floor";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { flatSchema } from "@/schemas/management/managementschema";
import { Tower, Wing, Floor, Meter } from "@/types/index.d";
import { useParams } from "next/navigation";

type FormInputs = z.infer<typeof flatSchema>;

export const AddFlatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addFlatMutation, isPending } = useAddFlat();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const { data: towersResponse } = useFilteredTowers(projectId);
  const { data: wingsResponse } = useWings();
  const { data: floorsResponse } = useFloors();
  const { data: metersResponse } = useMeters();

  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [selectedWingId, setSelectedWingId] = useState<string | null>(null);
  const [meterOpen, setMeterOpen] = useState(false);
  const [selectedMeterId, setSelectedMeterId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(flatSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!data.meter_id) {
      return;
    }

    const payload = {
      flat_no: data.flat_no,
      address: data.address,
      floor_id: Number(data.floor_id),
      meter_id: Number(data.meter_id),
    };

    addFlatMutation(payload, {
      onSuccess: (response) => {
        if (response.success) {
          onClose();
          onSuccess();
          reset();
          setSelectedMeterId("");
        }
      },
    });
  };

  const towers = ((towersResponse?.data as Tower[]) || []).filter(
    (tower) => tower.wings && tower.wings.length > 0
  );

  const wings = (wingsResponse?.data || []) as Wing[];
  const floors = (floorsResponse?.data || []) as Floor[];
  const meters = (metersResponse?.data || []) as Meter[];

  const filteredWings = wings.filter(
    (wing) => wing.tower_id === parseInt(selectedTowerId || "")
  );

  const defaultWing =
    filteredWings.length > 0 && filteredWings[0].name === "DEFAULT_WING";

  React.useEffect(() => {
    if (defaultWing) {
      setSelectedWingId(filteredWings[0].id.toString());
    }
  }, [defaultWing, filteredWings]);

  const filteredFloors = floors.filter(
    (floor: Floor) => floor.wing.id === parseInt(selectedWingId || "0")
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Flat</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill out the form below to create a new flat.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tower Selection */}
          <div className="space-y-2">
            <Label htmlFor="tower">Select Tower</Label>
            <Select
              onValueChange={(value) => {
                setSelectedTowerId(value);
                setSelectedWingId(null);
                setValue("floor_id", 0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a tower" />
              </SelectTrigger>
              <SelectContent>
                {towers.map((tower) => (
                  <SelectItem key={tower.id} value={tower.id.toString()}>
                    {tower.tower_name} - {tower.project.project_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Wing Selection - Hidden if DEFAULT_WING */}
          <div className={`space-y-2 ${defaultWing ? "hidden" : ""}`}>
            <Label htmlFor="wing">Select Wing</Label>
            <Select
              onValueChange={(value) => {
                setSelectedWingId(value);
                setValue("floor_id", 0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a wing" />
              </SelectTrigger>
              <SelectContent>
                {filteredWings.map((wing) => (
                  <SelectItem key={wing.id} value={wing.id.toString()}>
                    {wing.name === "DEFAULT_WING" ? "Default Wing" : wing.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Floor Selection */}
          <div className="space-y-2">
            <Label htmlFor="floor">Select Floor</Label>
            <Select
              onValueChange={(value) => setValue("floor_id", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a floor" />
              </SelectTrigger>
              <SelectContent>
                {filteredFloors.map((floor: Floor) => (
                  <SelectItem key={floor.id} value={floor.id.toString()}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.floor_id && (
              <p className="text-red-500 text-xs">{errors.floor_id.message}</p>
            )}
          </div>

          {/* Meter Selection with Combobox */}
          <div className="space-y-2">
            <Label htmlFor="meter">Select Meter</Label>
            <Popover open={meterOpen} onOpenChange={setMeterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={meterOpen}
                  className="w-full justify-between"
                >
                  {selectedMeterId
                    ? meters.find((meter) => meter.id.toString() === selectedMeterId)?.meter_id
                    : "Select meter..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search meter..." />
                  <CommandEmpty>No meter found.</CommandEmpty>
                  <CommandGroup>
                    {meters.map((meter) => (
                      <CommandItem
                        key={meter.id}
                        value={meter.meter_id}
                        onSelect={() => {
                          setSelectedMeterId(meter.id.toString());
                          setValue("meter_id", meter.id);
                          setMeterOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedMeterId === meter.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {meter.meter_id}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.meter_id && (
              <p className="text-red-500 text-xs">{errors.meter_id.message}</p>
            )}
          </div>

          {/* Flat Details */}
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Flat"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};