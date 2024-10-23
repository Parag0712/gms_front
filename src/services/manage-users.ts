import axiosInstance from '@/lib/axiosInstance';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

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

//---------------------------------- FETCH HANDLER ----------------------------------
async function fetchHandler<T>(
    url: string,
    method: HttpMethod,
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
        if (error.response?.data) {
            throw error.response.data; // Throw the error response from the server
        }
        throw new Error(error.message || 'An error occurred');
    }
}

//---------------------------------- CREATE USER PAYLOAD ----------------------------------
function createUserPayload(payload: Partial<UserPayload>): Partial<UserPayload> {
    return {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email_address: payload.email_address,
        password: payload.password,
        phone: payload.phone,
        role: payload.role,
    };
}

//---------------------------------- ADD USER ----------------------------------
export async function addUser(userData: UserPayload): Promise<ApiResponse> {
    const payload = createUserPayload(userData);
    return fetchHandler<ApiResponse>(`/admin/master/add-user`, 'POST', payload);
}

//---------------------------------- EDIT USER ----------------------------------
export async function editUser(
    userId: number,
    userData: Partial<Omit<UserPayload, 'password'>>
): Promise<ApiResponse> {
    const payload = createUserPayload(userData);
    return fetchHandler<ApiResponse>(`/admin/master/edit-user/${userId}`, 'PUT', payload);
}

//---------------------------------- DELETE USER ----------------------------------
export async function deleteUser(userId: number): Promise<ApiResponse> {
    return fetchHandler<ApiResponse>(`/admin/master/delete-user/${userId}`, 'DELETE');
}

//---------------------------------- GET ALL USERS ----------------------------------
export async function getAllUsers(): Promise<ApiResponse> {
    return fetchHandler<ApiResponse>(`/admin/master/get-users`, 'GET');
}

//---------------------------------- GET USER BY ID ----------------------------------
export async function getUserById(userId: number): Promise<ApiResponse> {
    return fetchHandler<ApiResponse>(`/admin/master/get-user/${userId}`, 'GET');
}

//---------------------------------- GET CURRENT USER ----------------------------------
export async function getCurrentUser(): Promise<ApiResponse> {
    return fetchHandler<ApiResponse>('/admin/current-user', 'GET');
}