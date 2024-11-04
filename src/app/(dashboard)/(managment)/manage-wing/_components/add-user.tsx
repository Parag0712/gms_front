// add-wing.tsx
import React from "react";
import { useAddWing } from "@/hooks/management/manage-wing";
import { useTowers } from "@/hooks/management/manage-tower";
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
import { Tower } from "@/types/index.d";

const wingCreateSchema = z.object({
  name: z.string().min(1, "Wing name is required"),
  tower_id: z.string().min(1, "Tower is required"),
});

type FormInputs = z.infer<typeof wingCreateSchema>;

export const AddWingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addWingMutation, isPending } = useAddWing();
  const { data: towersResponse } = useTowers();

  const { register, handleSubmit, reset, formState: { errors }, setValue } =
    useForm<FormInputs>({
      resolver: zodResolver(wingCreateSchema),
    });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const payload = {
      wing_name: data.name,
      tower_id: parseInt(data.tower_id),
    };

    addWingMutation(payload, {
      onSuccess: (response) => {
        if (response.success) {
          onClose();
          onSuccess();
          reset();
        }
      },
    });
  };

  const towers = (towersResponse?.data as Tower[] || []).filter(tower => tower.project.is_wing);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Wing</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Enter the details to add a new wing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tower">Select Tower</Label>
            <Select onValueChange={(value) => setValue("tower_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tower" />
              </SelectTrigger>
              <SelectContent>
                {towers.map((tower) => (
                  <SelectItem key={tower.id} value={tower.id.toString()}>
                    {tower.tower_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tower_id && (
              <p className="text-red-500 text-xs">{errors.tower_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Wing Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter wing name"
              className="w-full"
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
              {isPending ? "Adding..." : "Add Wing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
