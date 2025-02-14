import axios from 'axios';

// Tạo một instance axios với base URL
export const axiosInstance = axios.create({
    baseURL: 'http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1',
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
