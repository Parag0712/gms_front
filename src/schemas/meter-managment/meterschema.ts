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
    image: z.instanceof(File).optional(),
    status: z.nativeEnum(MeterStatus).default(MeterStatus.ACTIVE),
    isExisting: z.enum(["true", "false"]).default("false"),
    old_meter_reading: z.number().optional(),
});

export const editGmsMeterSchema = gmsMeterSchema.partial(); // Allows optional fields for editing

