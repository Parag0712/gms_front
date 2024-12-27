"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useAddBill } from "@/hooks/generate-bill/generate-bill";
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
import { Check, ChevronsUpDown } from "lucide-react";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(billCreateSchema),
    defaultValues: {
      current_reading: 0,
    },
  });

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

    const maxSize = 2 * 1024 * 1024; // 2MB limit
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
        className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Generate Bill
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to generate a new bill.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Flat Selection */}
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
                      ? `${selectedFlat.flat_no} - ${
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
                      <CommandEmpty>No occupied flat found.</CommandEmpty>
                      <CommandGroup>
                        {occupiedFlats.map((flat) => (
                          <CommandItem
                            key={flat.id}
                            value={flat.flat_no}
                            onSelect={() => handleFlatChange(flat)}
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
              {errors.customerId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerId.message}
                </p>
              )}
            </div>

            {/* Display selected flat information */}
            {selectedFlat && (
              <>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Flat Number
                  </Label>
                  <Input
                    value={selectedFlat.flat_no}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Customer Name
                  </Label>
                  <Input
                    value={`${selectedFlat.customer?.first_name || ""} ${
                      selectedFlat.customer?.last_name || ""
                    }`}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Meter ID
                  </Label>
                  <Input
                    value={selectedFlat.meter?.meter_id || "N/A"}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Previous Reading
                  </Label>
                  <Input
                    value={selectedFlat.meter?.previous_reading || "N/A"}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </>
            )}

            {/* Current Reading */}
            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="current_reading"
                className="text-xs sm:text-sm font-semibold"
              >
                Current Reading <span className="text-red-500">*</span>
              </Label>
              <Input
                id="current_reading"
                type="float"
                placeholder="Enter current meter reading"
                {...register("current_reading", { valueAsNumber: true })}
                className="w-full h-10"
              />
              {errors.current_reading && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.current_reading.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="image"
                className="text-xs sm:text-sm font-semibold"
              >
                Meter Image
                <span className="text-gray-500 text-xs ml-2">(Max: 2MB)</span>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full h-10 cursor-pointer"
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.image.message?.toString()}
                </p>
              )}
            </div>
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
              {isPending ? "Generating Bill..." : "Generate Bill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceModal;
