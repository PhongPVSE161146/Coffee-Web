import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

// Add Authorization token if needed
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

// Define API methods
export const apiService = {
  createTemplate: (payload) =>
    axiosInstance.post('/feedback-template/create-template', payload),
};