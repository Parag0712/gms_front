import { User } from 'next-auth';
import axiosInstance from '@/lib/axiosInstance';

// Define the structure of the login response
interface LoginResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: User | null;
}

//---------------------------------- FETCH HANDLER ----------------------------------
async function fetchHandler<T>(url: string, method: "GET" | "POST" | "PUT" | "DELETE", options?: object): Promise<T> {
    try {
        const response = await axiosInstance.request<T>({
            url,
            method,
            data: options,
        });
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            statusCode: error.response?.status || 500,
            message: error.response?.data?.message || 'An error occurred',
        } as T;
    }
}

//---------------------------------- LOGIN ADMIN ----------------------------------
export async function loginAdmin(email_address: string, password: string): Promise<LoginResponse> {
    return fetchHandler<LoginResponse>('/admin/login', 'POST', { email_address, password });
}
