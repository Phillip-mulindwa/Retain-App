import { api } from './client';
import type { DashboardSummary } from '../types';

export function fetchDashboardSummary(month: string) {
  return api.get<DashboardSummary>('/dashboard/summary', { params: { month } }).then((r) => r.data);
}
