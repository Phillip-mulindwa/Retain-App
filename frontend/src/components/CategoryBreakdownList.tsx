import { Box, Typography, Stack, Paper } from '@mui/material';
import { formatCurrency } from '../utils/format';
import type { CategorySpend } from '../types';

// A simple coloured-bar breakdown rather than pulling in a full chart
// library for one visual - each bar's width is that category's share
// of the total, and its colour matches the category's own colour
// everywhere else in the app (expense chips, etc).
export default function CategoryBreakdownList({ data }: { data: CategorySpend[] }) {
  const total = data.reduce((sum, c) => sum + c.total, 0);

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">No spending recorded for this month yet.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Spending by category
      </Typography>
      <Stack spacing={2}>
        {data.map((c) => {
          const pct = total > 0 ? (c.total / total) * 100 : 0;
          return (
            <Box key={c.categoryId}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {c.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(c.total)} · {pct.toFixed(0)}%
                </Typography>
              </Box>
              <Box sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: c.color, borderRadius: 4 }} />
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
