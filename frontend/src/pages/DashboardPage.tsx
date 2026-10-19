import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Grid, CircularProgress, Alert } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import { fetchDashboardSummary } from '../api/dashboard';
import { extractErrorMessage } from '../api/client';
import { useAuth } from '../features/auth/AuthContext';
import StatCard from '../components/StatCard';
import BudgetStatusCard from '../components/BudgetStatusCard';
import MonthPicker from '../components/MonthPicker';
import CategoryBreakdownList from '../components/CategoryBreakdownList';
import RecentExpensesList from '../components/RecentExpensesList';
import { currentMonth, formatCurrency } from '../utils/format';
import type { DashboardSummary } from '../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchDashboardSummary(month)
      .then(setSummary)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [month]);

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Welcome, {user?.name?.split(' ')[0]}
          </Typography>
          <Typography color="text.secondary">Here's how this month is looking.</Typography>
        </Box>
        <MonthPicker month={month} onChange={setMonth} />
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {loading || !summary ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <BudgetStatusCard
              totalSpent={summary.totalSpent}
              limit={summary.limit}
              remaining={summary.remaining}
              status={summary.status}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<PaidRoundedIcon />}
              label="Highest expense"
              value={summary.highestExpense ? formatCurrency(summary.highestExpense.amount) : '—'}
              hint={summary.highestExpense?.title}
              accent="#f59e0b"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<TrendingUpRoundedIcon />}
              label="Categories used"
              value={String(summary.byCategory.length)}
              hint="this month"
              accent="#0f766e"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CategoryBreakdownList data={summary.byCategory} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecentExpensesList expenses={summary.recentExpenses} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
