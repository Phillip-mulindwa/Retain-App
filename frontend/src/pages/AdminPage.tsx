import { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { fetchAdminInsights } from '../api/admin';
import { extractErrorMessage } from '../api/client';
import StatCard from '../components/StatCard';
import CategoryBreakdownList from '../components/CategoryBreakdownList';
import RecentExpensesList from '../components/RecentExpensesList';
import CategoryManager from '../features/admin/CategoryManager';
import CategoryUsageList from '../features/admin/CategoryUsageList';
import RecentUsersList from '../features/admin/RecentUsersList';
import { formatCurrency } from '../utils/format';
import type { AdminInsights } from '../types';

// Everything an admin needs in one page: platform-wide stats up top,
// category management (the one piece of data admins can actually
// mutate) in the middle, and the "who/what showed up recently" lists
// at the bottom.
export default function AdminPage() {
  const [insights, setInsights] = useState<AdminInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminInsights()
      .then(setInsights)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Admin dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading || !insights ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard icon={<GroupRoundedIcon />} label="Registered users" value={String(insights.totalUsers)} accent="#0f766e" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<ReceiptLongRoundedIcon />}
              label="Expenses recorded"
              value={String(insights.totalExpenses)}
              accent="#3b82f6"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<PaidRoundedIcon />}
              label="Total value recorded"
              value={formatCurrency(insights.totalValue)}
              accent="#f59e0b"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<CalendarMonthRoundedIcon />}
              label="Expenses this month"
              value={String(insights.expensesThisMonth)}
              accent="#ec4899"
            />
          </Grid>

          <Grid size={12}>
            <CategoryManager />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CategoryUsageList title="Top 5 most-used categories" data={insights.topCategories} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CategoryUsageList title="Bottom 5 least-used categories" data={insights.bottomCategories} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CategoryBreakdownList data={insights.spendingPerCategory} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecentExpensesList expenses={insights.recentExpenses} />
          </Grid>

          <Grid size={12}>
            <RecentUsersList users={insights.recentUsers} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
