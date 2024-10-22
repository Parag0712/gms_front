import { User } from 'next-auth';
import axiosInstance from '@/lib/axiosInstance';

interface Response {
    statusCode: number;
    message: string;
    data?: object | null;
}

interface UserResponse {
    statusCode: number;
    message: string;
    data?: User[] | null;
}

// Generic function to handle API requests
async function fetchHandler<T>(url: string, method: "GET" | "POST" | "PUT" | "DELETE", options?: object): Promise<T> {
    const response = await axiosInstance.request<T>({
        url,
        method,
        data: options,
    });
    return response.data;
}

// Common user payload generator to reduce redundancy
function createUserPayload(first_name: string, last_name: string, email_address: string, password?: string, phone?: string, role?: string) {
    return { first_name, last_name, email_address, password, phone, role };
}

// Add User
export async function addUser(first_name: string, last_name: string, email_address: string, password: string, phone: string, role: string): Promise<Response> {
    const payload = createUserPayload(first_name, last_name, email_address, password, phone, role);
    return fetchHandler<Response>(`/admin/master/add-user`, 'POST', payload);
}

// Edit User
export async function editUser(user_id: number, first_name: string, last_name: string, email_address: string, phone: string, role: string): Promise<Response> {
    const payload = createUserPayload(first_name, last_name, email_address, phone, role);
    return fetchHandler<Response>(`/admin/master/edit-user/${user_id}`, 'PUT', payload);
}

// Delete User
export async function deleteUser(user_id: number): Promise<Response> {
    return fetchHandler<Response>(`/admin/master/delete-user/${user_id}`, 'DELETE');
}

// Get All Users API
export async function getAllUsers(): Promise<UserResponse> {
    return fetchHandler<UserResponse>(`/admin/master/get-users`, 'GET');
}

// Get User By ID API
export async function getUserById(user_id: number): Promise<Response> {
    return fetchHandler<Response>(`/admin/master/get-user/${user_id}`, 'GET');
}

// Get Current User
export async function getCurrentUser(): Promise<Response> {
    return fetchHandler<Response>(`/admin/current-user`, 'GET');
}