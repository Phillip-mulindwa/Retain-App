import { api } from './client';
import type { Expense, ExpenseInput, Pagination } from '../types';

// Mirrors the ExpenseFilters redux slice shape exactly, so a component
// can spread the selector's state straight in as params with no mapping.
export interface ExpenseQuery {
  search?: string;
  category?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  sortBy?: 'date' | 'amount';
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export function fetchExpenses(query: ExpenseQuery) {
  return api
    .get<{ expenses: Expense[]; pagination: Pagination }>('/expenses', { params: query })
    .then((r) => r.data);
}

export function fetchExpense(id: string) {
  return api.get<{ expense: Expense }>(`/expenses/${id}`).then((r) => r.data.expense);
}

export function createExpense(data: ExpenseInput) {
  return api.post<{ expense: Expense }>('/expenses', data).then((r) => r.data.expense);
}

export function updateExpense(id: string, data: Partial<ExpenseInput>) {
  return api.put<{ expense: Expense }>(`/expenses/${id}`, data).then((r) => r.data.expense);
}

export function deleteExpense(id: string) {
  return api.delete<{ message: string }>(`/expenses/${id}`).then((r) => r.data);
}
