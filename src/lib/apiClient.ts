import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

// Determine the base URL for the API
// It prioritizes the NEXT_PUBLIC_API_URL environment variable,
// then falls back to a default for local development.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Axios instance for making API requests.
 * It's configured with a base URL and default headers.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Utility to get the authorization header with the JWT token.
 * Retrieves the token from localStorage.
 *
 * @returns {object|null} Authorization header or null if token is not found.
 */
const getAuthHeader = (): { Authorization?: string } | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return null;
};

// Request interceptor to automatically add the Authorization header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authHeaderObj = getAuthHeader();
    if (authHeaderObj && authHeaderObj.Authorization) {
      const authToken = authHeaderObj.Authorization;
      config.headers.set('Authorization', authToken);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional, can be expanded for token refresh logic)
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Example: Handle 401 Unauthorized for token refresh or redirect to login
    if (error.response && error.response.status === 401) {
      // Potentially clear token and redirect to login
      // console.error('Unauthorized, redirecting to login...');
      // if (typeof window !== 'undefined') {
      //   localStorage.removeItem('accessToken');
      //   localStorage.removeItem('refreshToken');
      //   localStorage.removeItem('user');
      //   window.location.href = '/login'; // Or role-specific login
      // }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
