import axiosInstance from '@/lib/axiosInstance';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: object | null;
    errors?: string | string[] | object | null;
}

interface UserPayload {
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
        console.error('Error in fetchHandler:', error);
        return {
            success: false,
            statusCode: error.response?.status || 500,
            message: error.response?.data?.message || 'An error occurred',
            errors: error.response?.data?.errors || error.message
        } as T;
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