import axios from 'axios';
import { env } from '../config/env';

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request
apiClient.interceptors.request.use(async (config) => {
  // Get token from Clerk
  // Note: window.Clerk is available after Clerk loads
  const token = await window.Clerk?.session?.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to sign-in if unauthorized
      // Use Clerk's built-in redirect to handle hosted pages or custom routes automatically
      if (window.Clerk && window.Clerk.redirectToSignIn) {
        window.Clerk.redirectToSignIn();
      } else {
        // Fallback if Clerk isn't loaded yet
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
