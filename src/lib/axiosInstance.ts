import axios from 'axios';
import { getSession } from 'next-auth/react';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to handle authentication
axiosInstance.interceptors.request.use(
    async (config) => {
        // Skip token addition for login requests
        if (!config.url?.endsWith('/admin/login')) {
            const session = await getSession()  ;
            const token = session?.user.token;

            // Add Authorization header if token exists
            if (token) {
                config.headers.Authorization = token;
            }
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

export default axiosInstance;
