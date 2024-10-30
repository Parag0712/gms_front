import React, { useEffect } from "react";
import { useEditLocality } from "@/hooks/management/manage-locality";
import { useCities } from "@/hooks/management/manage-city";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { City } from "@/types/index.d";
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

const localityEditSchema = z.object({
  area: z.string().min(1, "Area name is required"),
  city_id: z.string().min(1, "City is required"),
});

type FormInputs = z.infer<typeof localityEditSchema>;

interface Locality {
  id: number;
  area: string;
  city_id: number;
  city: {
    id: number;
    city: string;
  };
}

export const EditLocalityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedLocality: Locality | null;
}> = ({ isOpen, onClose, onSuccess, selectedLocality }) => {
  const { mutate: editLocalityMutation, isPending } = useEditLocality();
  const { data: citiesResponse } = useCities();

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormInputs>({
    resolver: zodResolver(localityEditSchema),
  });

  useEffect(() => {
    if (selectedLocality) {
      setValue("area", selectedLocality.area);
      setValue("city_id", selectedLocality.city_id.toString());
    }
  }, [selectedLocality, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedLocality) return;

    const payload = {
      area: data.area,
      city_id: parseInt(data.city_id),
    };

    editLocalityMutation(
      { localityId: selectedLocality.id, localityData: payload },
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

  const cities = citiesResponse?.data as City[] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Locality</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the locality details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">Select City</Label>
            <Select
              onValueChange={(value) => setValue("city_id", value)}
              defaultValue={selectedLocality?.city_id.toString()}
            >
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
