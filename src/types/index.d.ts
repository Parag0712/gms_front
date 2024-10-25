export interface ApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: object | null;
    errors: string[];
}

export interface UserPayload {
    first_name: string;
    last_name: string;
    email_address: string;
    password?: string;
    phone?: string;
    role?: "MASTER" | "ADMIN" | "AGENT";
}

export interface CustomerPayload {
    first_name: string;
    last_name: string;
    email_address: string;
    password?: string;
    phone?: string;
    approve?: boolean;
    role?: "OWNER" | "TENANT";
}

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    phone: string;
    role: string;
    approved_by: number | null;
    approved_time: string | null;
}

