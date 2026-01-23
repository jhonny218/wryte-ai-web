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
  // Get token from Clerk with a short retry in case Clerk hasn't finished initializing.
  // Note: window.Clerk is available after Clerk loads.
  const maxAttempts = 3;
  const delayMs = 200;
  let token: string | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      token = await (window as any).Clerk?.session?.getToken();
    } catch {
      // ignore and retry
      token = undefined;
    }

    if (token) break;

    // small delay before retrying
    // don't await on the last iteration
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  // Debug: log whether a token was attached (trimmed for privacy)
  try {
    if (token) {
      // show only prefix to avoid leaking full token in logs
      console.debug('[api-client] attaching Authorization header, token prefix:', `${token.slice(0, 12)}...`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.debug('[api-client] no Clerk token available; proceeding without Authorization header');
    }
  } catch (e) {
    console.warn('[api-client] failed to attach token', e);
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
