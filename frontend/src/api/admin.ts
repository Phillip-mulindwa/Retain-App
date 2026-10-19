import { api } from './client';
import type { AdminInsights } from '../types';

export function fetchAdminInsights() {
  return api.get<AdminInsights>('/admin/insights').then((r) => r.data);
}
