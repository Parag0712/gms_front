import axiosInstance from "@/lib/axiosInstance";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: object | null;
}

export interface CustomerPayload {
    first_name: string;
    last_name: string;
    email_address: string;
    phone: string;
    password: string;
    role: "OWNER" | "TENANT";
}

