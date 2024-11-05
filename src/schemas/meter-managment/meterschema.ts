import { MeterStatus } from "@/types/index.d";
import { z } from "zod";



export const gmsMeterSchema = z.object({
    meter_id: z
        .string()
        .nonempty({ message: "Meter ID is required" })
        .max(255, { message: "Meter ID must not exceed 255 characters" }),
        
    installation_at: z
        .string()
        .nonempty({ message: "Installation date is required" })
        .refine(
            (val) => !isNaN(new Date(val).getTime()),
            { message: "Please provide a valid date" }
        ),
    image: z.string().optional(),
    status: z.nativeEnum(MeterStatus).default(MeterStatus.ACTIVE),
});

export const editGmsMeterSchema = z.object({
    meter_id: z.string().max(255).optional(),
    installation_at: z
        .union([z.date(), z.string()])
        .transform((val) => (typeof val === "string" ? new Date(val) : val))
        .optional(),
    image: z.string().optional(),
    flat_id: z
        .union([z.number().int().positive().nullable(), z.string()])
        .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
        .optional(),
    status: z.nativeEnum(MeterStatus).default(MeterStatus.ACTIVE).optional(),
});
