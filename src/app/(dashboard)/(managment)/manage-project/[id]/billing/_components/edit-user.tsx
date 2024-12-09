import React, { useEffect } from "react";
import { useEditInvoice } from "@/hooks/invoice/invoice";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormInputs>({
    resolver: zodResolver(gmsInvoiceSchema),
    defaultValues: {
      gmsCustomerId: invoice?.gmsCustomerId || 0,
      unit_consumed: invoice?.unit_consumed || 0,
      status: invoice?.status || InvoiceStatus.UNPAID,
    }
  });

  useEffect(() => {
    if (invoice) {
      setValue("gmsCustomerId", invoice.gmsCustomerId);
      setValue("unit_consumed", invoice.unit_consumed);
      setValue("status", invoice.status);
    }
  }, [invoice, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!invoice) return;
    console.log('Data:', data);

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gmsCustomerId">Customer ID</Label>
              <Input type="number" {...register("gmsCustomerId", { valueAsNumber: true })} />
              {errors.gmsCustomerId && <p className="text-red-500 text-xs">{errors.gmsCustomerId.message}</p>}
            </div>

            <div>
              <Label htmlFor="unit_consumed">Units Consumed</Label>
              <Input type="number" step="0.01" {...register("unit_consumed", { valueAsNumber: true })} />
              {errors.unit_consumed && <p className="text-red-500 text-xs">{errors.unit_consumed.message}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select {...register("status")} className="w-full border rounded-md p-2">
                {Object.values(InvoiceStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
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