import { api } from './client';
import type { Category } from '../types';

export function fetchCategories() {
  return api.get<{ categories: Category[] }>('/categories').then((r) => r.data.categories);
}

export function createCategory(name: string, color: string) {
  return api.post<{ category: Category }>('/categories', { name, color }).then((r) => r.data.category);
}

export function updateCategory(id: string, data: { name?: string; color?: string }) {
  return api.put<{ category: Category }>(`/categories/${id}`, data).then((r) => r.data.category);
}

export function deleteCategory(id: string) {
  return api
    .delete<{ message: string; reassignedExpenses: number }>(`/categories/${id}`)
    .then((r) => r.data);
}
