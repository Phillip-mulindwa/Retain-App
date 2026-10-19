import { useEffect, useState } from 'react';
import { fetchCategories } from '../../api/categories';
import type { Category } from '../../types';

// Small shared hook - both the expense form and the admin category
// manager need the full category list, so neither has to duplicate
// the fetch-on-mount logic.
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  return { categories, loading, reload };
}
