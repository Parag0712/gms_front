// src/schemas/smsSchema.ts

import { z } from 'zod';

// Define the allowed SMSType values
export const SMSTypeEnum = z.enum(['billing', 'registration', 'verification', 'reminder', 'payment', 'other']);

// Schema for creating an SMS template
export const smsTemplateSchema = z.object({
    identifier: z.string().min(1, { message: "Identifier is required." }),
    description: z.string().min(1, { message: "Description is required." }),
    message: z.string().min(1, { message: "Message is required." }),
    type: SMSTypeEnum,
    variables: z.string().min(1, { message: "Variables are required." }),
});

// Schema for updating an SMS template
export const updateSMSTemplateSchema = z.object({
    description: z.string().optional(),
    message: z.string().optional(),
    type: SMSTypeEnum.optional(),
    variables: z.string().optional(),
});

export const smsPathParamsSchema = z.object({
    id: z.string(),
}); 
