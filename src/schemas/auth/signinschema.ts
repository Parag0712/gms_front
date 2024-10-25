import { z } from "zod";

export const signInSchema = z.object({
    email_address: z.string().email("Invalid email address"), // Validate email format
    password: z.string().min(6, "Password must be at least 6 characters long"), // Validate password length
});