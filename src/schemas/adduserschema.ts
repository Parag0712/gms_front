import { z } from 'zod';

// Admin create schema
export const userCreateSchema = z.object({
    first_name: z.string().min(1, "First name is required"), // First name is required
    last_name: z.string().min(1, "Last name is required"), // Last name is required
    email_address: z.string().email("Invalid email address"), // Validate email format
    phone: z.string().length(10, "Phone number must be 10 digits").regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"), // Validate phone number
    password: z.string().min(6, "Password must be at least 6 characters long"), // Validate password length
    role: z.enum(['MASTER', 'ADMIN', 'AGENT'], { required_error: "Role is required" }), // Role must be one of the enum values
});