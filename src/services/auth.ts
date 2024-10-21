import axios from 'axios';
import { User } from 'next-auth';
import axiosInstance from '../lib/axiosInstance';

// Define the structure of the login response
interface LoginResponse {
    statusCode: number;
    message: string;
    data?: User | null;
}

// Generic function to handle API requests
async function fetchHandler<T>(url: string, method: "GET" | "POST" | "PUT" | "DELETE", options?: object): Promise<T> {
    try {
        const response = await axiosInstance.request<T>({
            url,
            method,
            data: options,
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            const { statusCode, message } = error.response.data as LoginResponse;
            throw new Error(JSON.stringify({ statusCode, message, url }));
        }
        throw new Error(JSON.stringify({ statusCode: 500, message: "An unexpected error occurred", url }));
    }
}

// Function to handle login API calls
export async function loginAdmin(email_address: string, password: string): Promise<LoginResponse> {
    return fetchHandler<LoginResponse>(`/admin/login`, 'POST', { email_address, password });
}
