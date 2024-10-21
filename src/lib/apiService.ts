import { User } from 'next-auth';
import axiosInstance from './axiosInstance';
import axios from 'axios';

// Define the structure of the login response
interface LoginResponse {
    statusCode: number;
    message: string;
    data?: User;
}

//Generic function to handle API requests
async function fetchHandler<T>(url: string, options: object): Promise<T> {
    try {
        const response = await axiosInstance.post<T>(url, options);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            // If it's an Axios error with a response, extract status code and message
            const { statusCode, message } = error.response.data as LoginResponse;
            throw new Error(JSON.stringify({ statusCode, message }));
        }
        // For any other type of error, throw a generic 500 error
        throw new Error(JSON.stringify({ statusCode: 500, message: "An unexpected error occurred" }));
    }
}

// Function to handle login API calls
export async function loginApi(email_address: string, password: string): Promise<LoginResponse> {
    return await fetchHandler<LoginResponse>(`/admin/login`, {
        email_address,
        password,
    });
}
