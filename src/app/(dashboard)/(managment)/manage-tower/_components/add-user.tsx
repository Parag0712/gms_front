"use client";

import React from "react";
import { useAddTower } from "@/hooks/management/manage-tower";
import { useProjects } from "@/hooks/management/manage-project";
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
import { z } from "zod";
import { Project } from "@/types";

const towerCreateSchema = z.object({
  tower_name: z.string().min(1, "Tower name is required"),
  project_id: z.string().min(1, "Project is required"),
});

type FormInputs = z.infer<typeof towerCreateSchema>;

const AddTowerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addTowerMutation, isPending } = useAddTower();
  const { data: projectsResponse } = useProjects();

  const projects = projectsResponse?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(towerCreateSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    addTowerMutation(
      {
        tower_name: data.tower_name,
        project_id: parseInt(data.project_id),
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
          <DialogTitle className="text-xl font-bold">Add Tower</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill out the form below to create a new tower.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_id">
              Project <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="project_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(projects) &&
                      projects.map((project: Project) => (
                        <SelectItem
                          key={project.id}
                          value={project.id.toString()}
                        >
                          {project.locality.area}-{project.project_name} 
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.project_id && (
              <p className="text-red-500 text-xs">
                {errors.project_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tower_name">
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
              {isPending ? "Adding..." : "Add Tower"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTowerModal;
