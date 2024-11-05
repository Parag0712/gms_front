import { MeterStatus } from "@/types/index.d";
import { z } from "zod";

export const gmsMeterSchema = z.object({
    meter_id: z.string().max(255), // Unique meter identifier
    // installation_at: z.date(), // Date of installation
    installation_at: z.string({ message: "Expire at is required." })
    .min(5, { message: "Please pass correct date" }),
    flat_id: z
        .union([z.number().int().positive().nullable(), z.string()])
        .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val)), 
    image: z.string().optional(),
    // flat_id: z.number().int().positive().nullable().optional(), // Foreign key referencing GmsFlat, nullable if unassigned    
    status: z.nativeEnum(MeterStatus).default(MeterStatus.ACTIVE), // Status of the reading
});

export const editGmsMeterSchema = z.object({
    meter_id: z.string().max(255).optional(), // Unique meter identifier
    installation_at: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)).optional(), // Convert string to Date

    image: z.string().optional(),
    flat_id: z
    .union([z.number().int().positive().nullable(), z.string()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val)).optional(),
    status: z.nativeEnum(MeterStatus).default(MeterStatus.ACTIVE).optional(), // Status of the reading
});

