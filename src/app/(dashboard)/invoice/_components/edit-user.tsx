import React, { useEffect } from "react";
import { useEditInvoice } from "@/hooks/invoice/invoice";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gmsInvoiceSchema } from "@/schemas/invoice/invoice";
import { z } from "zod";
import { Invoice, InvoiceStatus } from "@/types/index.d";

// Define the form input types based on the schema
type FormInputs = z.infer<typeof gmsInvoiceSchema>;

// Define form fields for mapping
const formFields = [
  { name: "user_id", label: "User ID", type: "number" },
  { name: "gmsCustomerId", label: "Customer ID", type: "number" },
  { name: "unit_consumed", label: "Units Consumed", type: "number" },
  { name: "gas_unit_rate", label: "Gas Unit Rate", type: "number" },
  { name: "amc_cost", label: "AMC Cost", type: "number" },
  { name: "utility_tax", label: "Utility Tax", type: "number" },
  { name: "app_charges", label: "App Charges", type: "number" },
  { name: "penalty_amount", label: "Penalty Amount", type: "number" },
  { name: "overdue_penalty", label: "Overdue Penalty", type: "number" },
  { name: "bill_amount", label: "Bill Amount", type: "number" },
];

const EditInvoiceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: Invoice | null;
}> = ({ isOpen, onClose, onSuccess, invoice }) => {
  const { mutate: editInvoiceMutation, isPending } = useEditInvoice();

  // Initialize form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(gmsInvoiceSchema),
  });

  // Update form values when invoice changes
  useEffect(() => {
    if (invoice) {
      // Set values for all fields from the invoice
      Object.keys(invoice).forEach((key) => {
        const value = invoice[key as keyof Invoice];
        if (value !== undefined) {
          setValue(key as keyof FormInputs, value as any);
        }
      });
    }
  }, [invoice, setValue]);

  // Handle form submission
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!invoice) return;

    // Filter out undefined values
    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    ) as Required<FormInputs>;

    editInvoiceMutation(
      { invoiceId: invoice.id, invoiceData: updatedData },
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Invoice</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the invoice information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Grid layout for number input fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  step="0.01"
                  className="w-full"
                  {...register(field.name as keyof FormInputs, { 
                    valueAsNumber: true 
                  })}
                />
                {errors[field.name as keyof FormInputs] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name as keyof FormInputs]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select invoice status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InvoiceStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Toggle Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="generatedByAgent" className="text-sm font-medium">
                Generated by Agent
              </Label>
              <Controller
                name="generatedByAgent"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="collected_by_agent_coin" className="text-sm font-medium">
                Collected by Agent Coin
              </Label>
              <Controller
                name="collected_by_agent_coin"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoiceModal;