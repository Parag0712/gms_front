import { z } from "zod";

export const userEditSchema = z.object({
    first_name: z.string().min(1, "First name is required").optional(), // Optional First name
    last_name: z.string().min(1, "Last name is required").optional(), // Optional Last name
    email_address: z.string().email("Invalid email address").optional(), // Optional email
    phone: z.string().length(10, "Phone number must be 10 digits").regex(/^\d{10}$/, "Phone number must be a valid 10-digit number").optional(), // Optional phone number
    role: z.enum(['MASTER', 'ADMIN', 'AGENT']).optional(), // Optional role
});