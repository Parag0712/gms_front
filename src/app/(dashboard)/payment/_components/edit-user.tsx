"use client";

import React, { useEffect } from "react";
import { useEditPayment } from "@/hooks/payment/payment";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gmsPaymentSchema } from "@/schemas/payment/payment";
import { z } from "zod";
import { Payment, PaymentStatus } from "@/types/index.d";

type FormInputs = z.infer<typeof gmsPaymentSchema>;

const EditPaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payment: Payment | null;
}> = ({ isOpen, onClose, onSuccess, payment }) => {
  const { mutate: editPaymentMutation, isPending } = useEditPayment();
  
  const { register, handleSubmit, control, reset, formState: { errors }, setValue } = useForm<FormInputs>({
    resolver: zodResolver(gmsPaymentSchema),
  });

  useEffect(() => {
    if (payment) {
      Object.keys(payment).forEach((key) => {
        setValue(key as keyof FormInputs, payment[key as keyof Payment] as any);
      });
    }
  }, [payment, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!payment) return;

    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    ) as Required<FormInputs>;

    editPaymentMutation(
      { paymentId: payment.id, paymentData: updatedData },
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
          <DialogTitle>Edit Payment</DialogTitle>
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

            <div>
              <Label htmlFor="penalty_amount">Penalty Amount</Label>
              <Input type="number" step="0.01" {...register("penalty_amount", { valueAsNumber: true })} />
              {errors.penalty_amount && <p className="text-red-500 text-xs">{errors.penalty_amount.message}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select {...register("status")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default EditPaymentModal;
