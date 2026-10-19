import { Pagination as MuiPagination, Box, Typography } from '@mui/material';
import type { Pagination as PaginationType } from '../types';

interface Props {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

// Thin wrapper around MUI's Pagination that also shows the "x-y of z"
// label - reused by the expenses list and, if the dataset grows, the
// admin tables too.
export default function Pagination({ pagination, onPageChange }: Props) {
  const { page, limit, total, totalPages } = pagination;
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        mt: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {start}-{end} of {total}
      </Typography>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_e, value) => onPageChange(value)}
        color="primary"
        shape="rounded"
      />
    </Box>
  );
}
