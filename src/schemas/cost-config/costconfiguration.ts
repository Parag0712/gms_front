import { z } from "zod";

export const costConfigurationScheama = z.object({
    cost_name: z.string().min(1, "Cost name is required").max(255, "Cost name must be at most 255 characters long"),
    app_charges: z.number().positive("App charges must be a positive number"),
    amc_cost: z.number().positive("AMC cost must be a positive number"),
    utility_tax: z.number().positive("Utility tax must be a positive number"),
    penalty_amount: z.number().positive("Penalty amount must be a positive number"),
    gas_unit_rate: z.number().positive("Gas unit rate must be a positive number"),
})

export const editCostConfigurationSchema = z.object({
    cost_name: z.string().min(1, "Cost name is required").max(255, "Cost name must be at most 255 characters long"),
    app_charges: z.number().positive("App charges must be a positive number"),
    amc_cost: z.number().positive("AMC cost must be a positive number"),
    utility_tax: z.number().positive("Utility tax must be a positive number"),
    penalty_amount: z.number().positive("Penalty amount must be a positive number"),
    gas_unit_rate: z.number().positive("Gas unit rate must be a positive number"),
})