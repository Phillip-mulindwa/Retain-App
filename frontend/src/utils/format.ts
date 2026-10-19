import type { BudgetStatus } from '../types';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// "2026-10" -> the current month in that same "YYYY-MM" shape the
// backend expects for budgets and the dashboard summary.
export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function monthLabel(month: string): string {
  const [year, mon] = month.split('-').map(Number);
  return new Date(year, mon - 1, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Mirrors the backend's own status calculation (80% = approaching, so the
// frontend never shows a number that disagrees with what the API would say).
export function budgetStatusFrom(totalSpent: number, limit: number | null): BudgetStatus | null {
  if (limit == null) return null;
  const ratio = limit > 0 ? totalSpent / limit : totalSpent > 0 ? Infinity : 0;
  if (ratio > 1) return 'over';
  if (ratio >= 0.8) return 'approaching';
  return 'within';
}

export const statusLabels: Record<BudgetStatus, string> = {
  within: 'Within budget',
  approaching: 'Approaching limit',
  over: 'Over budget',
};
