import React, { useEffect } from "react";
import { useEditCity } from "@/hooks/management/manage-city";
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
import { citySchema } from "@/schemas/management/managementschema";

type FormInputs = z.infer<typeof citySchema>;

interface City {
  id: number;
  city: string;
  localities: Array<{
    id: number;
    area: string;
    city_id: number;
  }>;
}

export const EditCityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedCity: City | null;
}> = ({ isOpen, onClose, onSuccess, selectedCity }) => {
  const { mutate: editCityMutation, isPending } = useEditCity();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(citySchema),
  });

  useEffect(() => {
    if (selectedCity) {
      setValue("city", selectedCity.city);
    }
  }, [selectedCity, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedCity) return;

    editCityMutation(
      { cityId: selectedCity.id, cityData: data },
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
        className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Edit City
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Update the city details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-semibold">
              City Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              {...register("city")}
              placeholder="Enter city name"
              className="w-full h-10"
            />
            {errors.city && (
              <p className="text-red-500 text-xs">{errors.city.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 bg-primary"
            >
              {isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
