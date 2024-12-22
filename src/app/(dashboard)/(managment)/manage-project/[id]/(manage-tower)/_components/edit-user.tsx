"use client";

import React, { useEffect } from "react";
import { useEditTower } from "@/hooks/management/manage-tower";
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
import { Tower } from "@/types";

const towerEditSchema = z.object({
  tower_name: z.string().min(1, "Tower name is required"),
});

type FormInputs = z.infer<typeof towerEditSchema>;

const EditTowerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedTower: Tower | null;
}> = ({ isOpen, onClose, onSuccess, selectedTower }) => {
  const { mutate: editTowerMutation, isPending } = useEditTower();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(towerEditSchema),
  });

  useEffect(() => {
    if (selectedTower) {
      setValue("tower_name", selectedTower.tower_name);
    }
  }, [selectedTower, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedTower) return;

    editTowerMutation(
      {
        towerId: selectedTower.id,
        towerData: {
          tower_name: data.tower_name,
          project_id: selectedTower.project_id, // Keep the existing project_id
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
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Tower</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the tower information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2 ">
            <Label htmlFor="tower_name" className="text-sm font-semibold">
              Tower Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tower_name"
              {...register("tower_name")}
              placeholder="Enter tower name"
            />
            {errors.tower_name && (
              <p className="text-red-500 text-xs">
                {errors.tower_name.message}
              </p>
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

export default EditTowerModal;
