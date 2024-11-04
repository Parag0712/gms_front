"use client";

import React from "react";
import { useEditFloor } from "@/hooks/management/manage-floor";
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
  name: z.string().min(1, "Floor name is required"),
  wing_id: z.number({
    required_error: "Wing ID is required",
    invalid_type_error: "Wing ID must be a number",
  }),
});

type FormInputs = z.infer<typeof floorCreateSchema>;

const EditFloorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedFloor: any | null;
}> = ({ isOpen, onClose, onSuccess, selectedFloor }) => {
  const { mutate: editFloorMutation, isPending } = useEditFloor();

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormInputs>({
    resolver: zodResolver(floorCreateSchema),
  });

  React.useEffect(() => {
    if (selectedFloor) {
      setValue("name", selectedFloor.name);
      setValue("wing_id", selectedFloor.wing_id);
    }
  }, [selectedFloor, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedFloor) return;

    editFloorMutation(
      { floorId: selectedFloor.id, floorData: data },
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
          <DialogTitle className="text-xl font-bold">Edit Floor</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the floor information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Floor Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter floor name"
              className="w-full"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <input type="hidden" {...register("wing_id", { valueAsNumber: true })} />

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

export default EditFloorModal;
