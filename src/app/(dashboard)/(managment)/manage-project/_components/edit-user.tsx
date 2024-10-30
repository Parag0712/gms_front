import React, { useEffect, useState } from "react";
import { useEditProject } from "@/hooks/management/manage-project";
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
import { Locality, City, Project, CostConfiguration } from "@/types/index.d";

const projectEditSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  locality_id: z.string().min(1, "Locality is required"),
  city_id: z.string().min(1, "City is required"),
  is_wing: z.boolean(),
  cost_configuration_id: z.string().min(1, "Cost configuration is required"),
});

type FormInputs = z.infer<typeof projectEditSchema>;

export const EditProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedProject: Project | null;
}> = ({ isOpen, onClose, onSuccess, selectedProject }) => {
  const { mutate: editProjectMutation, isPending } = useEditProject();
  const { data: citiesResponse } = useCities();
  const { data: localitiesResponse } = useLocalities();
  const { data: costConfigsResponse } = useCostConfigs();
  const [filteredLocalities, setFilteredLocalities] = useState<Locality[]>([]);

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<FormInputs>({
    resolver: zodResolver(projectEditSchema),
  });

  useEffect(() => {
    if (selectedProject) {
      setValue("project_name", selectedProject.project_name);
      setValue("locality_id", selectedProject.locality_id.toString());
      setValue("city_id", selectedProject.locality.city_id.toString());
      setValue("is_wing", selectedProject.is_wing);
      setValue("cost_configuration_id", selectedProject.cost_configuration_id?.toString() || "");
      handleCityChange(selectedProject.locality.city_id.toString());
    }
  }, [selectedProject, setValue]);

  const handleCityChange = (cityId: string) => {
    setValue("city_id", cityId);
    setValue("locality_id", "");

    const localities = localitiesResponse?.data as Locality[] || [];
    const filtered = localities.filter((locality: any) =>
      locality.city_id === parseInt(cityId)
    );
    setFilteredLocalities(filtered);
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedProject) return;

    const payload = {
      project_name: data.project_name,
      locality_id: parseInt(data.locality_id),
      is_wing: data.is_wing,
      cost_configuration_id: parseInt(data.cost_configuration_id),
    };

    editProjectMutation(
      { projectId: selectedProject.id, projectData: payload },
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
  const costConfigs = costConfigsResponse?.data as CostConfiguration[] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Project</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the project details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">Select City</Label>
            <Select
              onValueChange={handleCityChange}
              defaultValue={selectedProject?.locality.city_id.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city: any) => (
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
            <Select
              onValueChange={(value) => setValue("locality_id", value)}
              defaultValue={selectedProject?.locality_id.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a locality" />
              </SelectTrigger>
              <SelectContent>
                {filteredLocalities.map((locality: any) => (
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
              defaultValue={selectedProject?.cost_configuration_id?.toString() || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cost configuration" />
              </SelectTrigger>
              <SelectContent>
                {costConfigs.map((config: any) => (
                  <SelectItem key={config.id} value={config.id.toString()}>
                    Rate: ₹{config.gas_unit_rate}/unit
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cost_configuration_id && (
              <p className="text-red-500 text-xs">{errors.cost_configuration_id.message}</p>
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
