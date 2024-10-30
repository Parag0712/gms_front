import React from "react";
import { useAddLocality } from "@/hooks/management/manage-locality";
import { useCities } from "@/hooks/management/manage-city";
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
import { City } from "@/types/index.d";

const localityCreateSchema = z.object({
  area: z.string().min(1, "Area name is required"),
  city_id: z.string().min(1, "City is required"),
});

type FormInputs = z.infer<typeof localityCreateSchema>;

export const AddLocalityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addLocalityMutation, isPending } = useAddLocality();
  const { data: citiesResponse } = useCities();

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormInputs>({
    resolver: zodResolver(localityCreateSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const payload = {
      area: data.area,
      city_id: parseInt(data.city_id),
    };

    addLocalityMutation(payload, {
      onSuccess: (response) => {
        if (response.success) {
          onClose();
          onSuccess();
          reset();
        }
      },
    });
  };

  const cities = citiesResponse?.data as City[] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Locality</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Enter the details to add a new locality.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">Select City</Label>
            <Select onValueChange={(value) => setValue("city_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city_id && (
              <p className="text-red-500 text-xs">{errors.city_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area Name</Label>
            <Input
              id="area"
              {...register("area")}
              placeholder="Enter area name"
              className="w-full"
            />
            {errors.area && (
              <p className="text-red-500 text-xs">{errors.area.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Locality"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
