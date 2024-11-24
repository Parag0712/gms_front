"use client";

import React, { useEffect } from "react";
import { useEditCostConfig } from "@/hooks/cost-config/cost-config";
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
import * as z from "zod";

// Define the validation schema
const costConfigSchema = z.object({
  cost_name: z.string().min(1, "Cost name is required"),
  register_fees: z.number().positive("Register fees must be a positive number"),
  app_charges: z.number().min(0),
  amc_cost: z.number().min(0),
  penalty_amount: z.number().min(0),
  gas_unit_rate: z.number().min(0),
  utility_tax: z.number().min(0),
  bill_due_date: z.string().min(1, "Bill due date is required"),
});

type FormInputs = z.infer<typeof costConfigSchema>;
type CostConfig = FormInputs & { id: number; created_at: string; updated_at: string };

const formFields = [
  {
    name: "cost_name",
    label: "Cost Name",
    type: "text",
    placeholder: "Enter cost name",
  },
  {
    name: "register_fees",
    label: "Register Fees",
    type: "number",
    placeholder: "Enter register fees",
  },
  {
    name: "app_charges",
    label: "App Charges",
    type: "number",
    placeholder: "Enter app charges",
  },
  {
    name: "amc_cost",
    label: "AMC Cost",
    type: "number",
    placeholder: "Enter AMC cost",
  },
  {
    name: "penalty_amount",
    label: "Penalty Amount",
    type: "number",
    placeholder: "Enter penalty amount",
  },
  {
    name: "gas_unit_rate",
    label: "Gas Unit Rate",
    type: "number",
    placeholder: "Enter gas unit rate",
  },
  {
    name: "utility_tax",
    label: "Utility Tax (%)",
    type: "number",
    placeholder: "Enter utility tax percentage",
  },
  {
    name: "bill_due_date",
    label: "Bill Due Date",
    type: "date",
    placeholder: "Enter bill due date",
  },
];

const EditCostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedCost: CostConfig | null;
}> = ({ isOpen, onClose, onSuccess, selectedCost }) => {
  const { mutate: editCostMutation, isPending } = useEditCostConfig();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<FormInputs>({
    resolver: zodResolver(costConfigSchema),
  });

  useEffect(() => {
    if (selectedCost) {
      Object.keys(costConfigSchema.shape).forEach((key) => {
        if (key === 'bill_due_date') {
          const date = new Date(selectedCost[key]);
          setValue(key, date.toISOString().split('T')[0]);
        } else {
          setValue(key as keyof FormInputs, selectedCost[key as keyof FormInputs]);
        }
      });
    }
  }, [selectedCost, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedCost) return;

    editCostMutation(
      { id: selectedCost.id, costData: data },
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
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Edit Cost Configuration
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to update the cost configuration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-semibold">
                  {field.label} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  step="any"
                  placeholder={field.placeholder}
                  {...register(field.name as keyof FormInputs, {
                    valueAsNumber: field.type === "number",
                  })}
                  className="w-full h-10"
                />
                {errors[field.name as keyof FormInputs] && (
                  <p className="text-red-500 text-xs">
                    {errors[field.name as keyof FormInputs]?.message}
                  </p>
                )}
              </div>
            ))}
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCostModal;