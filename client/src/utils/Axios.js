import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

// 🔹 Request interceptor (token add karne ke liye)
Axios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accesstoken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 🔹 Response interceptor (401 handle karne ke liye)
Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);

                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(originalRequest);
                }
            }
        }

        return Promise.reject(error);
    }
);

// 🔹 Refresh token function
const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios({
            ...SummaryApi.refreshToken,
            baseURL: baseURL,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });

        const accessToken = response.data.data.accessToken;
        localStorage.setItem("accesstoken", accessToken);

        return accessToken;
    } catch (error) {
        console.log("Refresh Token Error:", error);
    }
};

export default Axios;