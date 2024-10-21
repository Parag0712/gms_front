import axios from "axios";
import { BASE_URL } from "@/constants/constants";
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export default axiosInstance;
