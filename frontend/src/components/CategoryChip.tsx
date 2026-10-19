import { Chip } from '@mui/material';
import type { CategoryRef } from '../types';

// Every category carries its own colour from the DB, so this chip
// never has to guess - the same category always looks the same
// everywhere it shows up (expense rows, dashboard breakdown, admin).
export default function CategoryChip({ category }: { category: CategoryRef }) {
  return (
    <Chip
      label={category.name}
      size="small"
      sx={{
        bgcolor: `${category.color}22`,
        color: category.color,
        border: `1px solid ${category.color}55`,
      }}
    />
  );
}
