import React from "react";
import { useAddCity } from "@/hooks/management/manage-city";
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

const cityCreateSchema = z.object({
  city: z.string().min(1, "City name is required"),
});

type FormInputs = z.infer<typeof cityCreateSchema>;

export const AddCityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addCityMutation, isPending } = useAddCity();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(cityCreateSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    addCityMutation(data, {
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
          <DialogTitle className="text-xl font-bold">Add City</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Enter the details to add a new city.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">City Name</Label>
            <Input
              id="city"
              {...register("city")}
              placeholder="Enter city name"
              className="w-full"
            />
            {errors.city && (
              <p className="text-red-500 text-xs">{errors.city.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add City"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};