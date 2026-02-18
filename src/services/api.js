import axios from 'axios';

const API_BASE_URL = 'https://oceanx-backend.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
};

export const getData = async () => {
    try {
        const response = await api.get('/data');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
};

export const postData = async (data) => {
    try {
        const response = await api.post('/data', data);
        return response.data;
    } catch (error) {
        console.error('Failed to post data:', error);
        throw error;
    }
};

export default api;
