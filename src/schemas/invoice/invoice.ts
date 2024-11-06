import { z } from "zod";

const InvoiceStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID", 
  OVERDUE: "OVERDUE",
  PARTIALLY_PAID: "PARTIALLY_PAID"
} as const;

export const gmsInvoiceSchema = z.object({
  user_id: z.number().int().nonnegative({ message: "User ID is required" }).optional(),
  gmsCustomerId: z.number().int().nonnegative({ message: "Customer ID is required" }),
  generatedByAgent: z.boolean().default(false),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.UNPAID),
  unit_consumed: z.number().nonnegative({ message: "Units consumed cannot be negative" }),
  collected_by_agent_coin: z.boolean().default(false),
});