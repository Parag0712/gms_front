import { z } from "zod";
import { PaymentStatus } from "@/types/index.d";

export const gmsPaymentSchema = z.object({
    amount: z.number().nonnegative({ message: "Payment amount cannot be negative" }),
    method: z.string().nonempty({ message: "Payment method is required" }),
    invoice_id: z.number().int().nonnegative({ message: "Invoice ID is required" }),
    penalty_amount: z.number().nonnegative({ message: "Penalty amount cannot be negative" }),
    status: z.nativeEnum(PaymentStatus).default(PaymentStatus.UNPAID),
});