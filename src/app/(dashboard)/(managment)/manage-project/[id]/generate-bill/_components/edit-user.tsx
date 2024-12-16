import React, { useEffect } from "react";
import { useEditInvoice } from "@/hooks/invoice/invoice";
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
import { gmsInvoiceSchema } from "@/schemas/invoice/invoice";
import { z } from "zod";
import { Invoice, InvoicePayload, InvoiceStatus } from "@/types/index.d";

type FormInputs = z.infer<typeof gmsInvoiceSchema>;

export const EditInvoiceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: Invoice | null;
}> = ({ isOpen, onClose, onSuccess, invoice }) => {
  const { mutate: editInvoiceMutation, isPending } = useEditInvoice();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(gmsInvoiceSchema),
    defaultValues: {
      gmsCustomerId: invoice?.gmsCustomerId || 0,
      unit_consumed: invoice?.unit_consumed || 0,
      status: invoice?.status || InvoiceStatus.UNPAID,
      amc_cost: invoice?.amc_cost || 0,
      utility_tax: invoice?.utility_tax || 0,
      app_charges: invoice?.app_charges || 0,
      penalty_amount: invoice?.penalty_amount || 0,
      overdue_penalty: invoice?.overdue_penalty || 0,
      gas_unit_rate: invoice?.gas_unit_rate || 0,
    },
  });

  useEffect(() => {
    if (invoice) {
      setValue("gmsCustomerId", invoice.gmsCustomerId);
      setValue("unit_consumed", invoice.unit_consumed);
      setValue("status", invoice.status);
      setValue("amc_cost", invoice.amc_cost);
      setValue("utility_tax", invoice.utility_tax);
      setValue("app_charges", invoice.app_charges);
      setValue("penalty_amount", invoice.penalty_amount);
      setValue("overdue_penalty", invoice.overdue_penalty);
      setValue("gas_unit_rate", invoice.gas_unit_rate);
    }
  }, [invoice, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!invoice) return;
    console.log("Data:", data);

    editInvoiceMutation(
      { invoiceId: invoice.id, invoiceData: data as InvoicePayload },
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
      <DialogContent
        className="sm:max-w-[800px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Edit Invoice
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Update the Invoice details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="gmsCustomerId" className="text-sm font-semibold">
                Customer ID <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                {...register("gmsCustomerId", { valueAsNumber: true })}
              />
              {errors.gmsCustomerId && (
                <p className="text-red-500 text-xs">
                  {errors.gmsCustomerId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="unit_consumed" className="text-sm font-semibold">
                Units Consumed <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("unit_consumed", { valueAsNumber: true })}
              />
              {errors.unit_consumed && (
                <p className="text-red-500 text-xs">
                  {errors.unit_consumed.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="gas_unit_rate" className="text-sm font-semibold">
                Gas Unit Rate <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("gas_unit_rate", { valueAsNumber: true })}
              />
              {errors.gas_unit_rate && (
                <p className="text-red-500 text-xs">
                  {errors.gas_unit_rate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="amc_cost" className="text-sm font-semibold">
                AMC Cost <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("amc_cost", { valueAsNumber: true })}
              />
              {errors.amc_cost && (
                <p className="text-red-500 text-xs">
                  {errors.amc_cost.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="utility_tax" className="text-sm font-semibold">
                Utility Tax <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("utility_tax", { valueAsNumber: true })}
              />
              {errors.utility_tax && (
                <p className="text-red-500 text-xs">
                  {errors.utility_tax.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="app_charges">App Charges</Label>
              <Input
                type="number"
                step="0.01"
                {...register("app_charges", { valueAsNumber: true })}
              />
              {errors.app_charges && (
                <p className="text-red-500 text-xs">
                  {errors.app_charges.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="penalty_amount" className="text-sm font-semibold">
                Penalty Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("penalty_amount", { valueAsNumber: true })}
              />
              {errors.penalty_amount && (
                <p className="text-red-500 text-xs">
                  {errors.penalty_amount.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="overdue_penalty"
                className="text-sm font-semibold"
              >
                Overdue Penalty <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("overdue_penalty", { valueAsNumber: true })}
              />
              {errors.overdue_penalty && (
                <p className="text-red-500 text-xs">
                  {errors.overdue_penalty.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-semibold">
                Status <span className="text-red-500">*</span>
              </Label>
              <select
                {...register("status")}
                className="w-full border rounded-md p-2"
              >
                {Object.values(InvoiceStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
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

export default EditInvoiceModal;
