import axios from 'axios';
import Cookies from 'js-cookie';

// Create base instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors and auto-logout on 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - Auto logout
    if (error.response?.status === 401) {
      Cookies.remove('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden - Redirect to dashboard
    if (error.response?.status === 403) {
      window.location.href = '/dashboard';
    }

    return Promise.reject(error);
  }
);

export default api;