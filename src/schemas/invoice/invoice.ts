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
  amc_cost: z.number().nonnegative({ message: "AMC cost cannot be negative" }),
  utility_tax: z.number().nonnegative({ message: "Utility tax cannot be negative" }),
  app_charges: z.number().nonnegative({ message: "App charges cannot be negative" }),
  penalty_amount: z.number().nonnegative({ message: "Penalty amount cannot be negative" }),
  overdue_penalty: z.number().nonnegative({ message: "Overdue penalty cannot be negative" }),
  gas_unit_rate: z.number().nonnegative({ message: "Gas unit rate cannot be negative" }),
});