"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useEditCustomer } from "@/hooks/customers/manage-customers";
import { useFilteredFlats } from "@/hooks/management/manage-flat";
import { useMeters } from "@/hooks/meter-managment/meter";
import { useUpdatePreviousReading } from "@/hooks/customers/update-previous-reading";
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
import { customerEditSchema } from "@/schemas/customers/editcustomerschema";
import { z } from "zod";
import { Customer } from "@/types/index.d";
import { useParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import axiosInstance from "@/lib/axiosInstance";
import { CustomerPayload } from "@/types/index.d";

// Define the shape of our form inputs based on the schema
type FormInputs = z.infer<typeof customerEditSchema> & {
  meter_id?: string;
  previous_reading?: string;
};

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
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "Enter phone number",
  },
];

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
  status: string;
}

// Available roles for the select input
const roles = ["OWNER", "TENANT"] as const;

// EditUserModal component for editing users
const EditUserModal = ({
  isOpen,
  onClose,
  onSuccess,
  selectedUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedUser: Customer | null;
}) => {
  const params = useParams();
  const projectId = Number(params.id);
  const { data: flatsResponse } = useFilteredFlats(projectId);
  const { data: metersResponse } = useMeters();
  const flats = useMemo(() => flatsResponse?.data || [], [flatsResponse]);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [meterOpen, setMeterOpen] = useState(false);
  const [selectedMeterId, setSelectedMeterId] = useState("");
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const { mutate: updatePreviousReading } = useUpdatePreviousReading();
  const { mutate: editCustomerMutation, isPending } = useEditCustomer();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPendingDisabled, setIsPendingDisabled] = useState(false); // Added pending state

  // Initialize form handling with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(customerEditSchema),
  });

  const allMeters = useMemo(
    () => (metersResponse?.data || []) as Meter[],
    [metersResponse]
  );
  const unassignedMeters = allMeters.filter(
    (meter) => !meter.gmsFlat && meter.status === "ACTIVE"
  );

  // Update form values when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      console.log(selectedUser.disabled);
      setValue("first_name", selectedUser.first_name || "");
      setValue("last_name", selectedUser.last_name || "");
      setValue("email_address", selectedUser.email_address || "");
      setValue("phone", selectedUser.phone || "");
      setValue("role", selectedUser.role as "OWNER" | "TENANT" | undefined);

      // Update this section to use the nested flat object
      if (selectedUser.flat) {
        if (Array.isArray(flats)) {
          const userFlat = flats.find(
            (flat) => flat.id === selectedUser?.flat?.id
          );
          setSelectedFlat(userFlat || null);

          if (userFlat?.meter) {
            const meter = allMeters.find(
              (m) => m.meter_id === userFlat.meter?.meter_id
            );
            if (meter) {
              setSelectedMeterId(meter.id.toString());
              setSelectedMeter(meter);
            }
            setValue("previous_reading", userFlat.meter.previous_reading);
          }
        }
      }
      setIsDisabled(selectedUser.disabled || false);
    }
  }, [selectedUser, flats, allMeters, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedUser) return;

    const updatedData: CustomerPayload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email_address: data.email_address!,
      phone: data.phone,
      role: data.role,
      flatId: selectedFlat ? Number(selectedFlat.id) : undefined,
      disabled: isDisabled,
      meter_id:
        selectedMeter?.id?.toString() ||
        (selectedFlat?.meter
          ? allMeters
              .find((m) => m.meter_id === selectedFlat.meter?.meter_id)
              ?.id.toString()
          : undefined),
    };

    if (data.previous_reading) {
      const meterId =
        selectedMeter?.id ||
        (selectedFlat?.meter
          ? allMeters.find((m) => m.meter_id === selectedFlat.meter?.meter_id)
              ?.id
          : undefined);

      if (meterId) {
        updatePreviousReading({
          id: meterId,
          previous_reading: Number(data.previous_reading),
        });
      }
    }

    editCustomerMutation(
      {
        id: selectedUser.id,
        customerData: updatedData,
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

  const handleMeterSelect = (meter: Meter) => {
    setSelectedMeterId(meter.id.toString());
    setSelectedMeter(meter);
    setValue("meter_id", meter.id.toString());
    setMeterOpen(false);
  };

  const handleDisableToggle = async (checked: boolean) => {
    if (!selectedUser) return;
    try {
      setIsPendingDisabled(true); // Set loading state
      await axiosInstance.put(`/admin/disable-customer/${selectedUser.id}`, {
        disabled: checked,
      });
      setIsDisabled(checked);
    } catch (error) {
      console.error("Error toggling customer disabled status:", error);
    } finally {
      setIsPendingDisabled(false); // Reset loading state
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Edit Customer
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to edit this customer.
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
                  Flat
                </Label>
                <div className="w-full py-2 px-4 text-sm sm:text-base rounded-lg border border-gray-300 bg-gray-100">
                  {selectedFlat
                    ? `${selectedFlat.flat_no}, ${
                        selectedFlat.floor?.name || ""
                      } ${selectedFlat.floor?.wing?.tower?.tower_name || ""}`
                    : "No flat assigned"}
                </div>
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
                                    handleMeterSelect(meter);
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
                  <Input
                    id="previous_reading"
                    type="number"
                    placeholder="Enter previous reading"
                    className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    {...register("previous_reading")}
                  />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
              {isPending ? (
                <>
                  <span className="mr-2">Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
        {/* switch */}
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            checked={isDisabled}
            onCheckedChange={(checked) => {
              if (checked) {
                if (
                  window.confirm(
                    "Are you sure you want to disable this customer?"
                  )
                ) {
                  handleDisableToggle(checked);
                }
              } else {
                handleDisableToggle(checked);
              }
            }}
            disabled={isPendingDisabled}
            className={`${isDisabled ? "bg-red-500" : "bg-gray-200"}`}
          />
          <span
            className={`text-sm ${
              isDisabled ? "text-gray-500" : "text-red-500 font-semibold"
            }`}
          >
            {isDisabled
              ? "This customer is disabled."
              : "Warning: customer will be disabled permanently."}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
