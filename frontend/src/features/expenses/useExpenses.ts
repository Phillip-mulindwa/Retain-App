import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { fetchExpenses } from '../../api/expenses';
import { extractErrorMessage } from '../../api/client';
import type { Expense, Pagination } from '../../types';

// Bridges the Redux filter slice to the API: reads the current filters
// out of the store and refetches whenever any of them change. This is
// the only place expense filter state turns into an actual network
// call - components just call refresh() after a mutation.
export function useExpenses() {
  const filters = useAppSelector((state) => state.expenseFilters);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { expenses: data, pagination: meta } = await fetchExpenses({
        search: filters.search || undefined,
        category: filters.category || undefined,
        paymentMethod: filters.paymentMethod || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        amountMin: filters.amountMin ? Number(filters.amountMin) : undefined,
        amountMax: filters.amountMax ? Number(filters.amountMax) : undefined,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        page: filters.page,
        limit: filters.limit,
      });
      setExpenses(data);
      setPagination(meta);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { expenses, pagination, loading, error, refresh };
}
