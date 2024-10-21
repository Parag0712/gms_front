import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Use environment variable for API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token conditionally
axiosInstance.interceptors.request.use((config) => {
    // Check if the request is not to the /login endpoint
    if (!config.url?.endsWith('/admin/login')) {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
