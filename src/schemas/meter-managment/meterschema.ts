import { MeterStatus } from "@/types/index.d";
import { z } from "zod";

export const gmsMeterSchema = z.object({
    meter_id: z.string().max(255),
    installation_at: z.string({ message: "Expire at is required." })
        .min(5, { message: "Please pass correct date" }),
    flat_id: z
        .union([z.number().int().positive().nullable(), z.string()])
        .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val)),
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
