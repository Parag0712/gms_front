import { InvoiceStatus } from "@/types/index.d";
import { z } from "zod";

export const gmsInvoiceSchema = z.object({
  user_id: z.number().int().nonnegative({ message: "User ID is required" }),
  gmsCustomerId: z.number().int().nonnegative({ message: "Customer ID is required" }),
  generatedByAgent: z.boolean().default(false),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.UNPAID),
  unit_consumed: z.number().nonnegative({ message: "Units consumed cannot be negative" }),
  gas_unit_rate: z.number().nonnegative({ message: "Gas unit rate cannot be negative" }),
  amc_cost: z.number().default(0.0),
  utility_tax: z.number().default(0.0),
  app_charges: z.number().default(0.0),
  penalty_amount: z.number().default(0.0),
  overdue_penalty: z.number().nonnegative({ message: "Overdue penalty cannot be negative" }),
  bill_amount: z.number().nonnegative({ message: "Bill amount cannot be negative" }),
  collected_by_agent_coin: z.boolean().default(false),
});