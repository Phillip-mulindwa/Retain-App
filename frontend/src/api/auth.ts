import { api } from './client';
import type { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export function signup(name: string, email: string, password: string) {
  return api.post<AuthResponse>('/auth/signup', { name, email, password }).then((r) => r.data);
}

export function login(email: string, password: string) {
  return api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data);
}

export function fetchMe() {
  return api.get<{ user: User }>('/auth/me').then((r) => r.data.user);
}
