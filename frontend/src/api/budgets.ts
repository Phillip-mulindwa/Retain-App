import { api } from './client';
import type { Budget } from '../types';

export function fetchBudget(month: string) {
  return api.get<{ budget: Budget | null }>(`/budgets/${month}`).then((r) => r.data.budget);
}

export function setBudget(month: string, limit: number) {
  return api.put<{ budget: Budget }>(`/budgets/${month}`, { limit }).then((r) => r.data.budget);
}
