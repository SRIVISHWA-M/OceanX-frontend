import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
