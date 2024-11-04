"use client";

import React from "react";
import { useAddFloor } from "@/hooks/management/manage-floor";
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
import { z } from "zod";

// Define the schema for floor creation
const floorCreateSchema = z.object({
  floor_name: z.string().min(1, "Floor name is required"),
  wing_id: z.number({
    required_error: "Wing ID is required",
    invalid_type_error: "Wing ID must be a number",
  }),
});

type FormInputs = z.infer<typeof floorCreateSchema>;

export const AddFloorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  wingId: number;
}> = ({ isOpen, onClose, onSuccess, wingId }) => {
  const { mutate: addFloorMutation, isPending } = useAddFloor();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(floorCreateSchema),
    defaultValues: {
      wing_id: wingId
    }
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    addFloorMutation(data, {
      onSuccess: (response) => {
        if (response.success) {
          onClose();
          onSuccess();
          reset();
        }
      },
    });
  };

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
          <div className="space-y-2">
            <Label htmlFor="floor_name" className="text-sm font-medium">
              Floor Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="floor_name"
              placeholder="Enter floor name"
              className="w-full"
              {...register("floor_name")}
            />
            {errors.floor_name && (
              <p className="text-red-500 text-xs">{errors.floor_name.message}</p>
            )}
          </div>

          <input type="hidden" {...register("wing_id", { valueAsNumber: true })} />

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
