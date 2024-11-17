import axiosInstance from '@/lib/axiosInstance';
import { LoginResponse } from '@/types';

async function fetchHandler<T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    options?: object
): Promise<T> {
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

export async function loginAdmin(
    email_address: string,
    password: string
): Promise<LoginResponse> {
    return fetchHandler<LoginResponse>(
        '/admin/login',
        'POST',
        { email_address, password }
    );
}

export async function forgetPassword(
    email_address: string
): Promise<LoginResponse> {
    return fetchHandler<LoginResponse>(
        '/admin/forget-password',
        'POST',
        { email_address }
    );
}

export async function resetPassword(
    token: string,
    password: string,
    email_address: string
): Promise<LoginResponse> {
    return fetchHandler<LoginResponse>(
        '/admin/reset-password',
        'POST',
        { email_address, token, password }
    );
}
