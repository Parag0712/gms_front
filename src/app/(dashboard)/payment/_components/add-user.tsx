import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddPayment } from "@/hooks/payment/payment";
import { gmsPaymentSchema } from "@/schemas/payment/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type FormInputs = z.infer<typeof gmsPaymentSchema>;

export const AddPaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: addPaymentMutation, isPending } = useAddPayment();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(gmsPaymentSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
  console.log(data)
    addPaymentMutation(data, {
      onSuccess: (response) => {
        if (response.success) {
          onClose();
          onSuccess();
          reset();
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_id">Invoice ID</Label>
              <Input type="number" {...register("invoice_id", { valueAsNumber: true })} />
              {errors.invoice_id && <p className="text-red-500 text-xs">{errors.invoice_id.message}</p>}
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>

            <div>
              <Label htmlFor="method">Payment Method</Label>
              <Input {...register("method")} />
              {errors.method && <p className="text-red-500 text-xs">{errors.method.message}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};