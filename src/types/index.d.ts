export interface ApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: object | null;
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

export interface Customer extends CustomerPayload {
    id: number;
}

