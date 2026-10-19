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
