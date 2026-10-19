import { useEffect, useState, type FormEvent } from 'react';
import { Box, Typography, Stack, Paper, TextField, Button, Alert, Grid } from '@mui/material';
import { fetchDashboardSummary } from '../api/dashboard';
import { setBudget } from '../api/budgets';
import { extractErrorMessage } from '../api/client';
import BudgetStatusCard from '../components/BudgetStatusCard';
import MonthPicker from '../components/MonthPicker';
import { currentMonth } from '../utils/format';
import type { DashboardSummary } from '../types';

export default function BudgetPage() {
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [limitInput, setLimitInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDashboardSummary(month);
      setSummary(data);
      setLimitInput(data.limit != null ? String(data.limit) : '');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // Re-runs whenever the selected month changes, same "state change
  // drives a refetch" pattern as the expenses page.
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const limit = Number(limitInput);
    if (!limitInput || limit < 0) {
      setError('Enter a valid, non-negative monthly limit.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await setBudget(month, limit);
      setSuccess('Budget saved.');
      await load();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Budget
        </Typography>
        <MonthPicker month={month} onChange={setMonth} />
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {!loading && summary && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <BudgetStatusCard
              totalSpent={summary.totalSpent}
              limit={summary.limit}
              remaining={summary.remaining}
              status={summary.status}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {summary.limit != null ? 'Update your limit' : 'Set a monthly limit'}
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Monthly limit"
                    type="number"
                    value={limitInput}
                    onChange={(e) => setLimitInput(e.target.value)}
                    fullWidth
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                  <Button type="submit" variant="contained" disabled={saving} sx={{ whiteSpace: 'nowrap' }}>
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </Stack>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                You'll see a status of <strong>within</strong>, <strong>approaching</strong> (80% spent) or{' '}
                <strong>over</strong> budget as soon as it's set.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
