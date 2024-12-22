import { z } from 'zod';

// Customer create schema
export const customerCreateSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    // meter_id: z.string().max(255, "Meter ID is required"), 
    last_name: z.string().min(1, "Last name is required"),
    flatId: z.number().min(1, "Flat ID is required"),
    email_address: z.string().email("Invalid email address").max(255, "Email address must be at most 255 characters long"),
    phone: z.string().length(10, "Phone number must be 10 digits").regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"), // Assuming phone numbers are 10 digits
    password: z.string().min(6, "Password must be at least 6 characters long"), // You can add more rules here (e.g., complexity)
    role: z.enum(['OWNER', 'TENANT'], { required_error: "Role is required" }), // Role must be one of the defined enum values
    approve: z.boolean({ message: "Required field." }) // Optional boolean for admin approval
});