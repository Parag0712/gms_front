"use client";

import React, { useState } from "react";
import { useAddFloor } from "@/hooks/management/manage-floor";
import { useFilteredTowers } from "@/hooks/management/manage-tower";
import { useWings } from "@/hooks/management/manage-wing";
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
import { Tower, Wing } from "@/types/index.d";
import { useParams } from "next/navigation";

// Define the schema for floor creation
const floorCreateSchema = z.object({
  name: z.string().min(1, "Floor name is required"),
  wing_id: z.string().optional(),
});

type FormInputs = z.infer<typeof floorCreateSchema>;

export const AddFloorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addFloorMutation, isPending } = useAddFloor();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const { data: towersResponse } = useFilteredTowers(projectId);
  const { data: wingsResponse } = useWings();

  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormInputs>({
    resolver: zodResolver(floorCreateSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const payload = {
      name: data.name,
      wing_id: parseInt(data.wing_id!),
    };

    addFloorMutation(payload, {
      onSuccess: (response) => {
        if (response.success) {
          onClose();
          onSuccess();
          reset();
        }
      },
    });
  };

  const towers = ((towersResponse?.data as Tower[]) || []).filter(
    (tower) => tower.wings && tower.wings.length > 0
  ); // Filter towers to only those with wings

  const wings = (wingsResponse?.data as Wing[]) || [];

  // Filter wings based on selected tower
  const filteredWings = wings.filter(
    (wing) => wing.tower_id === parseInt(selectedTowerId || "")
  );

  // Check if the selected tower has a "DEFAULT_WING" and set it by default
  const defaultWing = filteredWings.length > 0 && filteredWings[0].name === "DEFAULT_WING";

  // Automatically set the wing ID to "DEFAULT_WING" if it exists
  React.useEffect(() => {
    if (defaultWing) {
      setValue("wing_id", filteredWings[0].id.toString());
    }
  }, [defaultWing, filteredWings, setValue]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Floor</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill out the form below to create a new floor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tower Selection */}
          <div className="space-y-2">
            <Label htmlFor="tower">Select Tower</Label>
            <Select
              onValueChange={(value) => {
                setSelectedTowerId(value);
                setValue("wing_id", ""); // Reset wing_id when tower changes
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
            {errors.wing_id && (
              <p className="text-red-500 text-xs">{errors.wing_id.message}</p>
            )}
          </div>

          {/* Conditional Wing Selection - Hidden if "DEFAULT_WING" */}
          <div className={`space-y-2 ${defaultWing ? "hidden" : ""}`}>
            <Label htmlFor="wing">Select Wing</Label>
            <Select onValueChange={(value) => setValue("wing_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a wing" />
              </SelectTrigger>
              <SelectContent>
                {filteredWings.map((wing) => (
                  <SelectItem key={wing.id} value={wing.id.toString()}>
                    {wing.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.wing_id && (
              <p className="text-red-500 text-xs">{errors.wing_id.message}</p>
            )}
          </div>

          {/* Floor Name Input */}
          <div className="space-y-2">
            <Label htmlFor="floor_name" className="text-sm font-medium">
              Floor Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="floor_name"
              placeholder="Enter floor name"
              className="w-full"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Floor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
