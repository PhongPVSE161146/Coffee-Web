import axios from 'axios';

// Tạo một instance axios với base URL
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5161/swagger/index.html',
    headers: {
        'Content-Type': 'application/json',
        accept: '*/*'
    },
});

// Thêm interceptors để tự động thêm token vào headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
