"use client";

import React, { useState } from "react";
import { useAddFlat } from "@/hooks/management/manage-flat";
import { useFilteredTowers } from "@/hooks/management/manage-tower";
import { useWings } from "@/hooks/management/manage-wing";
import { useFloors } from "@/hooks/management/manage-floor";
import { useMeters } from "@/hooks/meter-managment/meter";
import { useProjectById } from "@/hooks/management/manage-project";
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
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { flatSchema } from "@/schemas/management/managementschema";
import { Tower, Wing, Floor, Meter, Project } from "@/types/index.d";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

type FormInputs = z.infer<typeof flatSchema>;

export const AddFlatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addFlatMutation, isPending } = useAddFlat();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const { data: projectResponse } = useProjectById(projectId);
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
    const payload = {
      flat_no: data.flat_no,
      floor_id: Number(data.floor_id),
      meter_id: selectedMeterId ? Number(selectedMeterId) : undefined,
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

  const project = projectResponse?.data as Project;
  const showWingSelection = project?.is_wing;

  const towers = ((towersResponse?.data as Tower[]) || []).filter(
    (tower) => tower.wings && tower.wings.length > 0
  );

  const wings = (wingsResponse?.data || []) as Wing[];
  const floors = (floorsResponse?.data || []) as Floor[];
  const allMeters = (metersResponse?.data || []) as Meter[];

  // Filter out meters that are already assigned to flats
  const unassignedMeters = allMeters.filter((meter) => !meter.gmsFlat && meter.status === "ACTIVE");

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
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Flat</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill out the form below to create a new flat.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tower Selection */}
          <div className="space-y-2">
            <Label htmlFor="tower" className="text-sm font-semibold">
              Select Tower
            </Label>
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

          {/* Wing Selection - Only show if project is wing type */}
          {showWingSelection && (
            <div className={`space-y-2 ${defaultWing ? "hidden" : ""}`}>
              <Label htmlFor="wing" className="text-sm font-semibold">
                Select Wing
              </Label>
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
                      {wing.name === "DEFAULT_WING"
                        ? "Default Wing"
                        : wing.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Floor Selection */}
          <div className="space-y-2">
            <Label htmlFor="floor" className="text-sm font-semibold">
              Select Floor
            </Label>
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
                          className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
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

          {/* Flat Details */}
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
