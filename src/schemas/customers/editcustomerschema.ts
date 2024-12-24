import { z } from "zod";

export const customerEditSchema = z.object({
    first_name: z.string().min(1, { message: "First name is required." }).optional(), // Optional first name
    last_name: z.string().min(1, { message: "Last name is required." }).optional(), // Optional last name
    email_address: z.string().email({ message: "Invalid email address." }).optional(), // Optional email address
    phone: z.string().length(10, { message: "Phone number must be 10 digits." }).optional(), // Optional phone number
    profile_img_url: z.string().url({ message: "Invalid URL for profile image." }).optional(), // Optional profile image URL
    role: z.enum(['OWNER', 'TENANT']).optional(), // Optional role with enum
    flatId: z.number().min(1, "Flat ID is required").optional(),
});
