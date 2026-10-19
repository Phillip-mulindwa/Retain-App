import axios from 'axios';

// Single axios instance every api/*.ts module shares. The token is
// attached here rather than in AuthContext so any request - even one
// fired before a component re-renders - always carries the latest
// token straight out of localStorage.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('retain_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a token expires or gets invalidated mid-session, every request
// from then on would otherwise fail with its own confusing "Invalid or
// expired session" alert on whatever page happens to be open. Catch it
// once, here, and bounce back to login instead - skip it on the auth
// pages themselves so a wrong password on login doesn't also trigger a
// redirect loop.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const onAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
    if (axios.isAxiosError(error) && error.response?.status === 401 && !onAuthPage) {
      localStorage.removeItem('retain_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Normalises whatever axios/the backend throws into a plain message
// string so components can just show it, no matter if it was a network
// failure or a 4xx from the API.
export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong.';
}
