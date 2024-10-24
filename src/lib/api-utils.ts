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
