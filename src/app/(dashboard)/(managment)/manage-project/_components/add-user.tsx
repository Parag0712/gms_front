import React, { useState } from "react";
import { useAddProject } from "@/hooks/management/manage-project";
import { useCities } from "@/hooks/management/manage-city";
import { useLocalities } from "@/hooks/management/manage-locality";
import { useCostConfigs } from "@/hooks/cost-config/cost-config";
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
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { Locality, City, CostConfiguration } from "@/types/index.d";

const projectCreateSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  is_wing: z.boolean(),
  locality_id: z.string().min(1, "Locality is required"),
  city_id: z.string().min(1, "City is required"),
  cost_configuration_id: z.string().optional(),
});

type FormInputs = z.infer<typeof projectCreateSchema>;

export const AddProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addProjectMutation, isPending } = useAddProject();
  const { data: citiesResponse } = useCities();
  const { data: localitiesResponse } = useLocalities();
  const { data: costConfigsResponse } = useCostConfigs();
  const [filteredLocalities, setFilteredLocalities] = useState<Locality[]>([]);

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } =
    useForm<FormInputs>({
      resolver: zodResolver(projectCreateSchema),
      defaultValues: {
        is_wing: false,
      },
    });

  const handleCityChange = (cityId: string) => {
    setValue("city_id", cityId);
    setValue("locality_id", "");

    const localities = localitiesResponse?.data as Locality[] || [];
    const filtered = localities.filter(
      (locality: Locality) => locality.city_id === parseInt(cityId)
    );
    setFilteredLocalities(filtered);
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const payload = {
      project_name: data.project_name,
      is_wing: data.is_wing,
      locality_id: parseInt(data.locality_id),
      cost_configuration_id: data.cost_configuration_id 
        ? parseInt(data.cost_configuration_id)
        : null,
    };

    addProjectMutation(payload, {
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
  const costConfigs = costConfigsResponse?.data as CostConfiguration[] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Project</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Enter the details to add a new project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">Select City</Label>
            <Select onValueChange={handleCityChange}>
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
            <Label htmlFor="locality">Select Locality</Label>
            <Select onValueChange={(value) => setValue("locality_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a locality" />
              </SelectTrigger>
              <SelectContent>
                {filteredLocalities.map((locality) => (
                  <SelectItem key={locality.id} value={locality.id.toString()}>
                    {locality.area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.locality_id && (
              <p className="text-red-500 text-xs">{errors.locality_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_name">Project Name</Label>
            <Input
              id="project_name"
              {...register("project_name")}
              placeholder="Enter project name"
              className="w-full"
            />
            {errors.project_name && (
              <p className="text-red-500 text-xs">{errors.project_name.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_wing"
              checked={watch("is_wing")}
              onCheckedChange={(checked) => setValue("is_wing", checked as boolean)}
            />
            <Label htmlFor="is_wing">Is Wing Project?</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost_configuration">Cost Configuration</Label>
            <Select 
              onValueChange={(value) => setValue("cost_configuration_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cost configuration" />
              </SelectTrigger>
              <SelectContent>
                {costConfigs.map((config) => (
                  <SelectItem key={config.id} value={config.id.toString()}>
                    Rate: ₹{config.gas_unit_rate}/unit
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};