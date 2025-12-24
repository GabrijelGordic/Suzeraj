import axios from "axios";

// If the environment variable exists (Railway), use it.
// Otherwise, fall back to localhost (Your Laptop).
const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API,
});

// Interceptor: attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;