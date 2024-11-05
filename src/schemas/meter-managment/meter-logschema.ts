import { z } from "zod";
import { ReadingStatus } from "@/types/index.d";


export const gmsMeterReadingLogSchema = z.object({
    meter_id: z.union([z.number().int(), z.string()]) // Foreign key for GmsMeter
        .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val)),
    reading: z.union([z.number(), z.string()]) // Current meter reading
        .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
    previous_reading: z.union([z.number(), z.string()]) // Previous meter reading
        .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
    current_reading: z.union([z.number(), z.string()]) // Current meter reading
        .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
    image: z.string().optional(), // URL to the meter reading image
    units_consumed: z.union([z.number(), z.string()]).default(0) // Units consumed
        .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),

    status: z.nativeEnum(ReadingStatus).default(ReadingStatus.VALID), // Status of the reading
});

export const editGmsMeterReadingLogSchema = gmsMeterReadingLogSchema.partial(); // Allows optional fields for editing
