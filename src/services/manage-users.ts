import axiosInstance from '@/lib/axiosInstance';

// Types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: object | null;
}

interface UserPayload {
    first_name: string;
    last_name: string;
    email_address: string;
    password?: string;
    phone?: string;
    role?: string;
}

// API Error Class
class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Generic API request handler with error handling
 */
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
        const message = error.response?.data?.message || 'An error occurred';
        const statusCode = error.response?.status || 500;
        throw new ApiError(statusCode, message, error.response?.data);
    }
}

/**
 * Creates a new user payload with type safety
 */
function createUserPayload(payload: UserPayload): UserPayload {
    return {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email_address: payload.email_address,
        password: payload.password,
        phone: payload.phone,
        role: payload.role,
    };
}

// API Functions
/**
 * Adds a new user to the system
 */
export async function addUser(userData: Required<Omit<UserPayload, 'password'>> & { password: string }): Promise<ApiResponse> {
    const payload = createUserPayload(userData);
    return fetchHandler<ApiResponse>(`/admin/master/add-user`, 'POST', payload);
}

/**
 * Updates an existing user's information
 */
export async function editUser(
    userId: number,
    userData: Omit<UserPayload, 'password'>
): Promise<ApiResponse> {
    const payload = createUserPayload(userData);
    return fetchHandler<ApiResponse>(`/admin/master/edit-user/${userId}`, 'PUT', payload);
}

/**
 * Deletes a user from the system
 */
export async function deleteUser(userId: number): Promise<ApiResponse> {
    return fetchHandler<ApiResponse>(`/admin/master/delete-user/${userId}`, 'DELETE');
}

/**
 * Retrieves all users from the system
 */
export async function getAllUsers(): Promise<ApiResponse> {
    return fetchHandler<ApiResponse>(`/admin/master/get-users`, 'GET');
}

/**
 * Retrieves a specific user by their ID
 */
export async function getUserById(userId: number): Promise<ApiResponse> {
    return fetchHandler<ApiResponse>(`/admin/master/get-user/${userId}`, 'GET');
}

/**
 * Retrieves the currently logged-in user
 */
export async function getCurrentUser(): Promise<ApiResponse> {
    return fetchHandler<ApiResponse>('/admin/current-user', 'GET');
}