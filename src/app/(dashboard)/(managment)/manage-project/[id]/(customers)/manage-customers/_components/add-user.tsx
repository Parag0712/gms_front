"use client";

import React, { useState } from "react";
import { useAddCustomer } from "@/hooks/customers/manage-customers";
import { useFilteredFlats } from "@/hooks/management/manage-flat";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMeters } from "@/hooks/meter-managment/meter";
import { useUpdatePreviousReading } from "@/hooks/customers/update-previous-reading";
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
import { customerCreateSchema } from "@/schemas/customers/addcustomerschema";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Customer } from "@/types/index.d";

// Define the shape of our form inputs based on the schema
type FormInputs = z.infer<typeof customerCreateSchema> & {
  meter_id?: string;
  previous_reading?: string;
};

// Define the flat type
interface Flat {
  id: string;
  flat_no: string;
  meter?: {
    meter_id: string;
    previous_reading?: string;
  } | null;
  floor?: {
    name: string;
    wing?: {
      tower?: {
        tower_name: string;
      };
    };
  };
  customer?: Customer | null;
}

interface Meter {
  id: number;
  meter_id: string;
  gmsFlat: Flat | null;
  previous_reading?: string;
}

// Define form fields for easy mapping and reusability
const formFields = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Enter first name",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Enter last name",
  },
  {
    name: "email_address",
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "Enter phone number",
  },
];

// Available roles for the select input
const roles = ["OWNER", "TENANT"];

// AddCustomerModal component for adding new customers
const AddCustomerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const params = useParams();
  const projectId = Number(params.id);
  const { data: flatsResponse, refetch: refetchFlats } =
    useFilteredFlats(projectId);
  const { data: metersResponse, refetch: refetchMeters } = useMeters();
  const flats = (flatsResponse?.data || []) as Flat[];
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [meterOpen, setMeterOpen] = useState(false);
  const [selectedMeterId, setSelectedMeterId] = useState("");
  const [flatOpen, setFlatOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [newPreviousReading, setNewPreviousReading] = useState<string>("");
  const [isUpdatingReading, setIsUpdatingReading] = useState(false);

  const { mutate: updatePreviousReading } = useUpdatePreviousReading();
  const { mutate: addCustomerMutation, isPending } = useAddCustomer();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(customerCreateSchema),
  });

  const allMeters = (metersResponse?.data || []) as Meter[];
  const unassignedMeters = allMeters.filter((meter) => !meter.gmsFlat);
  const unoccupiedFlats = flats.filter((flat) => !flat.customer);

  const handleUpdatePreviousReading = () => {
    if (selectedMeter && newPreviousReading) {
      setIsUpdatingReading(true);
      updatePreviousReading(
        {
          id: selectedMeter.id,
          previous_reading: Number(newPreviousReading),
        },
        {
          onSuccess: async () => {
            setValue("previous_reading", newPreviousReading);
            await Promise.all([refetchFlats(), refetchMeters()]);
            setIsUpdatingReading(false);
          },
          onError: () => {
            setIsUpdatingReading(false);
          },
        }
      );
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const customerData = {
      ...data,
      flatId: Number(data.flatId),
      meter_id: data.meter_id,
      disabled: false,
    };

    if (selectedFlat?.meter?.meter_id) {
      customerData.meter_id = selectedFlat.meter.meter_id;
    } else if (selectedMeterId) {
      customerData.meter_id = selectedMeterId;
    }

    addCustomerMutation(customerData, {
      onSuccess: (response) => {
        if (response.success) {
          onClose();
          onSuccess();
          reset();
          setSelectedFlat(null);
          setSelectedMeterId("");
          setSelectedMeter(null);
          setNewPreviousReading("");
        }
      },
    });
  };

  const handleFlatChange = (flatId: string) => {
    const flat = unoccupiedFlats.find((f: Flat) => f.id === flatId);
    setSelectedFlat(flat || null);
    setSelectedMeterId("");
    setValue("flatId", Number(flatId));

    if (flat?.meter?.previous_reading) {
      setValue("previous_reading", flat.meter.previous_reading);
      setNewPreviousReading(flat.meter.previous_reading);
    } else {
      setValue("previous_reading", "");
      setNewPreviousReading("");
    }
    setFlatOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Add Customer
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to create a new customer.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Personal Information */}
            <div className="space-y-4">
              {formFields.map((field) => (
                <div key={field.name} className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="text-xs sm:text-sm font-semibold"
                  >
                    {field.label} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    {...register(field.name as keyof FormInputs)}
                  />
                  {errors[field.name as keyof FormInputs] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name as keyof FormInputs]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column - Additional Information */}
            <div className="space-y-4">
              {/* Flat selection */}
              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="flatId"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Flat <span className="text-red-500">*</span>
                </Label>
                <Popover open={flatOpen} onOpenChange={setFlatOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={flatOpen}
                      className="w-full justify-between"
                    >
                      {selectedFlat
                        ? `${selectedFlat.flat_no}, ${
                            selectedFlat.floor?.name || ""
                          } ${
                            selectedFlat.floor?.wing?.tower?.tower_name || ""
                          }`
                        : "Select a flat..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search flat..." />
                      <CommandList>
                        <CommandEmpty>No unoccupied flat found.</CommandEmpty>
                        <CommandGroup>
                          {unoccupiedFlats.map((flat) => (
                            <CommandItem
                              key={flat.id}
                              value={flat.flat_no}
                              onSelect={() => handleFlatChange(flat.id)}
                              className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedFlat?.id === flat.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {`${flat.flat_no}, ${flat.floor?.name || ""} ${
                                flat.floor?.wing?.tower?.tower_name || ""
                              }`}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.flatId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.flatId.message}
                  </p>
                )}
              </div>

              {/* Meter ID */}
              {selectedFlat && (
                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="meter_id"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Meter ID{" "}
                    {!selectedFlat.meter && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  {selectedFlat.meter ? (
                    <Input
                      id="meter_id"
                      type="text"
                      value={selectedFlat.meter.meter_id}
                      readOnly
                      className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <Popover open={meterOpen} onOpenChange={setMeterOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={meterOpen}
                          className="w-full justify-between"
                        >
                          {selectedMeterId
                            ? unassignedMeters.find(
                                (meter) =>
                                  meter.id.toString() === selectedMeterId
                              )?.meter_id
                            : "Select a meter..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search meter..." />
                          <CommandList>
                            <CommandEmpty>
                              No unassigned meter found.
                            </CommandEmpty>
                            <CommandGroup>
                              {unassignedMeters.map((meter) => (
                                <CommandItem
                                  key={meter.id}
                                  value={meter.meter_id}
                                  onSelect={() => {
                                    const newValue = meter.id.toString();
                                    setSelectedMeterId(
                                      newValue === selectedMeterId
                                        ? ""
                                        : newValue
                                    );
                                    setSelectedMeter(meter);
                                    setValue("meter_id", meter.id.toString());
                                    setMeterOpen(false);
                                  }}
                                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedMeterId === meter.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {meter.meter_id}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                  {!selectedFlat.meter && errors.meter_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.meter_id?.message}
                    </p>
                  )}
                </div>
              )}

              {/* Previous Reading */}
              {(selectedFlat?.meter || selectedMeterId) && (
                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="previous_reading"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Previous Reading <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2 relative">
                    <Input
                      id="new_previous_reading"
                      type="number"
                      placeholder="Enter previous reading"
                      className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                      value={newPreviousReading}
                      {...register("previous_reading", {
                        onChange: (e) => setNewPreviousReading(e.target.value), 
                      })}
                      {...register("previous_reading")}
                      // onChange={(e) => setNewPreviousReading(e.target.value)}
                      // {...register("previous_reading")}
                    />
                    <Button
                      type="button"
                      onClick={handleUpdatePreviousReading}
                      disabled={!newPreviousReading || isUpdatingReading}
                      className="whitespace-nowrap"
                    >
                      {isUpdatingReading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update Reading"
                      )}
                    </Button>
                  </div>
                  {errors.previous_reading && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.previous_reading.message}
                    </p>
                  )}
                </div>
              )}

              {/* Role selection */}
              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="role"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Role <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Approve checkbox */}
              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="approve"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Approve <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="approve"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <Checkbox
                        id="approve"
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="ml-2 text-sm sm:text-base">
                        I approve this customer
                      </span>
                    </div>
                  )}
                />
                {errors.approve && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.approve.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form action buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {isPending ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;
