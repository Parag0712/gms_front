"use client";

import React, { useState, useEffect } from "react";
import { useAddFlat } from "@/hooks/management/manage-flat";
import { useTowers } from "@/hooks/management/manage-tower";
import { useWings } from "@/hooks/management/manage-wing";
import { useFloors } from "@/hooks/management/manage-floor";
import { useCustomers } from "@/hooks/customers/manage-customers";
import { useMeters } from "@/hooks/meter-managment/meter";
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
import { flatSchema } from "@/schemas/management/managementschema";
import { Tower, Wing, Floor, Customer, Meter } from "@/types/index.d";

type FormInputs = z.infer<typeof flatSchema>;

export const AddFlatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addFlatMutation, isPending } = useAddFlat();
  const { data: towersResponse } = useTowers();
  const { data: wingsResponse } = useWings();
  const { data: floorsResponse } = useFloors();
  const { data: customersResponse } = useCustomers();
  const { data: metersResponse } = useMeters();

  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [selectedWingId, setSelectedWingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(flatSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Only submit if customer_id and meter_id are provided
    if (!data.customer_id || !data.meter_id) {
      return;
    }

    const payload = {
      flat_no: data.flat_no,
      address: data.address,
      floor_id: Number(data.floor_id),
      customer_id: Number(data.customer_id),
      meter_id: Number(data.meter_id),
    };

    addFlatMutation(payload, {
      onSuccess: (response) => {
        if (response.success) {
          onClose();
          onSuccess();
          reset();
        }
      },
    });
  };

  const towers = ((towersResponse?.data as Tower[]) || []).filter(
    (tower) => tower.wings && tower.wings.length > 0
  );

  const wings = (wingsResponse?.data || []) as Wing[];
  const floors = (floorsResponse?.data || []) as Floor[];
  const customers = (customersResponse?.data || []) as Customer[];
  const meters = (metersResponse?.data || []) as Meter[];

  const filteredWings = wings.filter(
    (wing) => wing.tower_id === parseInt(selectedTowerId || "")
  );

  // Check if the selected tower has a "DEFAULT_WING" and set it by default
  const defaultWing =
    filteredWings.length > 0 && filteredWings[0].name === "DEFAULT_WING";

  // Automatically set the wing ID when there's a DEFAULT_WING
  React.useEffect(() => {
    if (defaultWing) {
      setSelectedWingId(filteredWings[0].id.toString());
    }
  }, [defaultWing, filteredWings]);

  const filteredFloors = floors.filter(
    (floor: Floor) => floor.wing.id === parseInt(selectedWingId || "0")
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Flat</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill out the form below to create a new flat.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tower Selection */}
          <div className="space-y-2">
            <Label htmlFor="tower">Select Tower</Label>
            <Select
              onValueChange={(value) => {
                setSelectedTowerId(value);
                setSelectedWingId(null);
                setValue("floor_id", 0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a tower" />
              </SelectTrigger>
              <SelectContent>
                {towers.map((tower) => (
                  <SelectItem key={tower.id} value={tower.id.toString()}>
                    {tower.tower_name} - {tower.project.project_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Wing Selection - Hidden if DEFAULT_WING */}
          <div className={`space-y-2 ${defaultWing ? "hidden" : ""}`}>
            <Label htmlFor="wing">Select Wing</Label>
            <Select
              onValueChange={(value) => {
                setSelectedWingId(value);
                setValue("floor_id", 0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a wing" />
              </SelectTrigger>
              <SelectContent>
                {filteredWings.map((wing) => (
                  <SelectItem key={wing.id} value={wing.id.toString()}>
                    {wing.name === "DEFAULT_WING" ? "Default Wing" : wing.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Floor Selection */}
          <div className="space-y-2">
            <Label htmlFor="floor">Select Floor</Label>
            <Select
              onValueChange={(value) => setValue("floor_id", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a floor" />
              </SelectTrigger>
              <SelectContent>
                {filteredFloors.map((floor: Floor) => (
                  <SelectItem key={floor.id} value={floor.id.toString()}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.floor_id && (
              <p className="text-red-500 text-xs">{errors.floor_id.message}</p>
            )}
          </div>

          {/* Customer Selection */}
          <div className="space-y-2">
            <Label htmlFor="customer">Select Customer</Label>
            <Select
              onValueChange={(value) => setValue("customer_id", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer: Customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.first_name} {customer.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customer_id && (
              <p className="text-red-500 text-xs">
                {errors.customer_id.message}
              </p>
            )}
          </div>

          {/* Meter Selection */}
          <div className="space-y-2">
            <Label htmlFor="meter">Select Meter</Label>
            <Select
              onValueChange={(value) => setValue("meter_id", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a meter" />
              </SelectTrigger>
              <SelectContent>
                {meters.map((meter: Meter) => (
                  <SelectItem key={meter.id} value={meter.id.toString()}>
                    {meter.meter_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.meter_id && (
              <p className="text-red-500 text-xs">{errors.meter_id.message}</p>
            )}
          </div>

          {/* Flat Details */}
          <div className="space-y-2">
            <Label htmlFor="flat_no" className="text-sm font-medium">
              Flat Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="flat_no"
              placeholder="Enter flat number"
              className="w-full"
              {...register("flat_no")}
            />
            {errors.flat_no && (
              <p className="text-red-500 text-xs">{errors.flat_no.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="Enter address"
              className="w-full"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Flat"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
