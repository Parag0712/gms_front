import axios from "axios";
import { BASE_URL } from "@/constants/constants";
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        console.log(config);
        config.headers['Authorization'] = `Bearer: `;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
