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
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { Locality, City, CostConfiguration } from "@/types/index.d";

const projectCreateSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  app_charges_boolean: z.boolean().optional(),
  is_wing: z.boolean(),
  locality_id: z.string().min(1, "Locality is required"),
  city_id: z.string().min(1, "City is required"),
  cost_configuration_id: z.string().optional(),
  service_person_email: z.string().email("Invalid email address").max(255, "Email address must be at most 255 characters long"),
  service_person_name: z.string().min(1, "First name is required"),
  service_person_phone: z.string().length(10, "Phone number must be 10 digits").regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
  service_person_whatsapp: z.string().length(10, "Whatsapp number must be 10 digits").regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
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
        app_charges_boolean: false,
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
      service_person_email: data.service_person_email,
      service_person_name: data.service_person_name,
      service_person_phone: data.service_person_phone,
      service_person_whatsapp: data.service_person_whatsapp,
      app_charges_boolean: data.app_charges_boolean,
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
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Project</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fill in the project details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-sm font-semibold">City <span className="text-red-500">*</span></Label>
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

            <div className="space-y-1.5">
              <Label htmlFor="locality">Locality <span className="text-red-500">*</span></Label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="project_name">Project Name <span className="text-red-500">*</span></Label>
              <Input
                id="project_name"
                {...register("project_name")}
                placeholder="Enter project name"
              />
              {errors.project_name && (
                <p className="text-red-500 text-xs">{errors.project_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cost_configuration">Cost Configuration <span className="text-red-500">*</span></Label>
              <Select onValueChange={(value) => setValue("cost_configuration_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cost configuration" />
                </SelectTrigger>
                <SelectContent>
                  {costConfigs.map((config) => (
                    <SelectItem key={config.id} value={config.id.toString()}>
                      {config.cost_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="app_charges_boolean"
                checked={watch("app_charges_boolean")}
                onCheckedChange={(checked) => setValue("app_charges_boolean", checked)}
              />
              <Label htmlFor="app_charges_boolean">App Charges</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_wing"
                checked={watch("is_wing")}
                onCheckedChange={(checked) => setValue("is_wing", checked as boolean)}
              />
              <Label htmlFor="is_wing">Is Wing Project?</Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="service_person_name">Service Person Name <span className="text-red-500">*</span></Label>
              <Input
                id="service_person_name"
                {...register("service_person_name")}
                placeholder="Enter service person name"
              />
              {errors.service_person_name && (
                <p className="text-red-500 text-xs">{errors.service_person_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="service_person_email">Service Person Email <span className="text-red-500">*</span></Label>
              <Input
                id="service_person_email"
                {...register("service_person_email")}
                placeholder="Enter service person email"
              />
              {errors.service_person_email && (
                <p className="text-red-500 text-xs">{errors.service_person_email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="service_person_phone">Service Person Phone <span className="text-red-500">*</span></Label>
              <Input
                id="service_person_phone"
                {...register("service_person_phone")}
                placeholder="Enter service person phone"
              />
              {errors.service_person_phone && (
                <p className="text-red-500 text-xs">{errors.service_person_phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="service_person_whatsapp">Service Person WhatsApp <span className="text-red-500">*</span></Label>
              <Input
                id="service_person_whatsapp"
                {...register("service_person_whatsapp")}
                placeholder="Enter service person whatsapp"
              />
              {errors.service_person_whatsapp && (
                <p className="text-red-500 text-xs">{errors.service_person_whatsapp.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={onClose} variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};