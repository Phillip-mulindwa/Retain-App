import { Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { budgetStatusColors } from '../theme/theme';
import { formatCurrency, statusLabels } from '../utils/format';
import type { BudgetStatus } from '../types';

interface Props {
  totalSpent: number;
  limit: number | null;
  remaining: number | null;
  status: BudgetStatus | null;
}

// Reused on both the Budget page and the user dashboard - one visual
// language for "how am I doing this month" everywhere it appears.
export default function BudgetStatusCard({ totalSpent, limit, remaining, status }: Props) {
  const progress = limit ? Math.min(100, (totalSpent / limit) * 100) : 0;
  const color = status ? budgetStatusColors[status] : '#64748b';

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Spent this month
          </Typography>
          {status && (
            <Chip
              label={statusLabels[status]}
              size="small"
              sx={{ bgcolor: `${color}1f`, color, fontWeight: 700 }}
            />
          )}
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {formatCurrency(totalSpent)}
        </Typography>

        {limit != null ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              of {formatCurrency(limit)} budgeted · {formatCurrency(Math.abs(remaining ?? 0))}{' '}
              {remaining != null && remaining < 0 ? 'over' : 'remaining'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mt: 2,
                height: 10,
                borderRadius: 5,
                bgcolor: 'rgba(0,0,0,0.06)',
                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 5 },
              }}
            />
          </>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No budget set for this month yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
