import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

axios.post(`${API}/auth/users/`, data)

// 2. The Interceptor (The Security Guard)
// Before every request, check if we have a token in LocalStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // If token exists, attach it to the header: "Authorization: Token xyz123"
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;