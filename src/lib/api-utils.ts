import axiosInstance from '@/lib/axiosInstance';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function fetchHandler<T>(
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
            throw error.response.data;
        }
        throw new Error(error.message || 'An error occurred');
    }
}


export async function fetchHandlerWithFormData<T>(
    url: string,
    method: HttpMethod,
    options?: object
): Promise<T> {
    try {
        const headers = options instanceof FormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };

        const response = await axiosInstance.request<T>({
            url,
            method,
            data: options,
            headers,  // Set headers based on data type
        });
        
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            throw error.response.data;
        }
        throw new Error(error.message || 'An error occurred');
    }
}

