"use client";

import React from "react";
import { useAddCostConfig } from "@/hooks/cost-config/cost-config";
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
  bill_due_date: z.string().transform((str) => new Date(str)),
  transaction_percentage: z
    .number()
    .min(0, "Transaction percentage must be at least 0")
    .max(100, "Transaction percentage must be at most 100"),
});

type FormInputs = z.infer<typeof costConfigSchema>;
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
    label: "Utility Tax",
    type: "number",
    placeholder: "Enter utility tax percentage",
  },
  {
    name: "bill_due_date",
    label: "Bill Due Date",
    type: "date",
    placeholder: "Enter bill due date",
  },
  {
    name: "transaction_percentage",
    label: "Transaction Percentage",
    type: "number",
    placeholder: "Enter transaction percentage",
  },
];
const AddCostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addCostMutation, isPending } = useAddCostConfig();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(costConfigSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    addCostMutation(
      {
        ...data,
        bill_due_date: data.bill_due_date.toISOString().split("T")[0],
      },
      {
        onSuccess: (response: { success: boolean }) => {
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
            Add Cost Configuration
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to create a new cost configuration.
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
              {isPending ? "Adding..." : "Add Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCostModal;
