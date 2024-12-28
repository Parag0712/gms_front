"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAddBill } from "@/hooks/generate-bill/generate-bill";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Check, ChevronsUpDown, FileText } from "lucide-react";
import { z } from "zod";
import { BillPayload } from "@/types";
import { cn } from "@/lib/utils";
import { useFilteredFlats } from "@/hooks/management/manage-flat";

const billCreateSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  current_reading: z.number().min(0, "Current reading must be positive"),
  image: z.any().optional(),
});

type FormInputs = z.infer<typeof billCreateSchema>;

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Flat {
  id: string;
  flat_no: string;
  meter?: {
    meter_id: string;
    previous_reading?: string;
    previous_reading_date?: string;
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

interface Customer {
  id: number;
  first_name: string;
  last_name?: string;
}

const AddInvoiceModal: React.FC<AddBillModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const params = useParams();
  const projectId = Number(params.id);
  const { mutate: addBillMutation, isPending } = useAddBill();
  const { data: flatsResponse } = useFilteredFlats(projectId);
  const flats = (flatsResponse?.data || []) as Flat[];
  const occupiedFlats = flats.filter((flat) => flat.customer);
  const [flatOpen, setFlatOpen] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [unitsConsumed, setUnitsConsumed] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<FormInputs>({
    resolver: zodResolver(billCreateSchema),
    defaultValues: {
      current_reading: 0,
    },
  });

  useEffect(() => {
    const previousReading = parseFloat(
      selectedFlat?.meter?.previous_reading || "0"
    );
    const currentReading = watch("current_reading");
    if (!isNaN(previousReading) && !isNaN(currentReading)) {
      setUnitsConsumed(Math.abs(currentReading - previousReading));
    } else {
      setUnitsConsumed(null);
    }
  }, [selectedFlat, watch("current_reading")]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("customerId", data.customerId);
      formData.append("current_reading", data.current_reading.toString());

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      addBillMutation(formData as BillPayload, {
        onSuccess: (response) => {
          if (response.success) {
            onClose();
            onSuccess();
            reset();
            setSelectedFlat(null);
          }
        },
        onError: (error) => {
          console.error("Error generating bill:", error);
        },
      });
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("image", {
        type: "manual",
        message: "Image size must be less than 2MB",
      });
      e.target.value = "";
      return;
    }

    setValue("image", file, { shouldValidate: true });
  };

  const handleFlatChange = (flat: Flat) => {
    setSelectedFlat(flat);
    if (flat.customer) {
      setValue("customerId", flat.customer.id.toString());
    }
    setFlatOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
            <FileText className="h-6 w-6" />
            Utility Bill Generation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            {/* Header Section */}
            <div className="border-b-2 border-gray-200 pb-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-gray-800">
                    Meter Reading Bill
                  </h2>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="w-48">
                  <Popover open={flatOpen} onOpenChange={setFlatOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={flatOpen}
                        className="w-full justify-between"
                      >
                        {selectedFlat
                          ? `${selectedFlat.flat_no}`
                          : "Select Flat"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0">
                      <Command>
                        <CommandInput placeholder="Search flat..." />
                        <CommandList>
                          <CommandEmpty>No occupied flat found.</CommandEmpty>
                          <CommandGroup>
                            {occupiedFlats.map((flat) => (
                              <CommandItem
                                key={flat.id}
                                value={flat.flat_no}
                                onSelect={() => handleFlatChange(flat)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedFlat?.id === flat.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {flat.flat_no}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Customer Details Section */}
            {selectedFlat && (
              <div className="py-6 border-b-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Customer Details
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm text-gray-600">
                      Customer Name
                    </Label>
                    <p className="text-base font-medium">
                      {`${selectedFlat.customer?.first_name || ""} ${
                        selectedFlat.customer?.last_name || ""
                      }`}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Flat Number</Label>
                    <p className="text-base font-medium">
                      {`${selectedFlat.flat_no}, ${
                        selectedFlat.floor?.name || ""
                      } ${selectedFlat.floor?.wing?.tower?.tower_name || ""}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Meter Reading Section */}
            {selectedFlat && (
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Meter Details
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-600">Meter ID</Label>
                      <p className="text-base font-medium">
                        {selectedFlat.meter?.meter_id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Previous Reading
                      </Label>
                      <p className="text-base font-medium">
                        {selectedFlat.meter?.previous_reading || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Previous Reading Date
                      </Label>
                      <p className="text-base font-medium">
                        {new Date(
                          selectedFlat.meter?.previous_reading_date as string
                        ).toLocaleString() || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="current_reading"
                        className="text-sm text-gray-600"
                      >
                        Current Reading <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="current_reading"
                        type="float"
                        step="0.01"
                        placeholder="Enter current reading"
                        {...register("current_reading", {
                          valueAsNumber: true,
                        })}
                        className="mt-1"
                      />
                      {errors.current_reading && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.current_reading.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Units Consumed
                      </Label>
                      <p className="text-base font-medium">
                        {unitsConsumed !== null
                          ? unitsConsumed >= 0
                            ? `${unitsConsumed.toFixed(3)} units`
                            : "Invalid reading"
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="mt-6">
                  <Label htmlFor="image" className="text-sm text-gray-600">
                    Meter Reading Image
                    <span className="text-gray-500 text-xs ml-2">
                      (Max: 2MB)
                    </span>
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1"
                  />
                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.image.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t-2 border-gray-200">
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
                {isPending ? "Generating Bill..." : "Generate Bill"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceModal;
