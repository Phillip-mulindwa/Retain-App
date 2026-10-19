import { Paper, Typography, Stack, Box, Chip } from '@mui/material';
import type { CategorySpend } from '../../types';

interface Props {
  title: string;
  data: CategorySpend[];
}

// Shared by both "top 5 most-used" and "bottom 5 least-used" - same
// shape of data, just sorted differently before it gets here.
export default function CategoryUsageList({ title, data }: Props) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>
      {data.length === 0 ? (
        <Typography color="text.secondary">Nothing to show yet.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {data.map((c) => (
            <Box key={c.categoryId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip label={c.name} size="small" sx={{ bgcolor: `${c.color}22`, color: c.color, fontWeight: 600 }} />
              <Typography variant="body2" color="text.secondary">
                {c.count} expense{c.count === 1 ? '' : 's'}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
