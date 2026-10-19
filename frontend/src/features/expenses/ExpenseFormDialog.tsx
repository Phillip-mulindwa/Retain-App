import { useEffect, useState, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Alert,
} from '@mui/material';
import { createExpense, updateExpense } from '../../api/expenses';
import { extractErrorMessage } from '../../api/client';
import { PAYMENT_METHODS } from '../../types';
import type { Category, Expense, ExpenseInput } from '../../types';

interface Props {
  open: boolean;
  categories: Category[];
  expense: Expense | null; // null = creating a new one
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm: ExpenseInput = {
  title: '',
  amount: 0,
  category: '',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: 'Card',
  notes: '',
};

// One dialog handles both create and edit - whether `expense` is set
// decides which API call fires on submit. Keeps the form markup (and
// its validation) from being written twice.
export default function ExpenseFormDialog({ open, categories, expense, onClose, onSaved }: Props) {
  const [form, setForm] = useState<ExpenseInput>(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title,
        amount: expense.amount,
        category: expense.category._id,
        date: expense.date.slice(0, 10),
        paymentMethod: expense.paymentMethod,
        notes: expense.notes || '',
      });
    } else {
      setForm({ ...emptyForm, category: categories[0]?._id || '' });
    }
    setError('');
  }, [expense, open, categories]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.category) {
      setError('Pick a category.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (expense) {
        await updateExpense(expense._id, form);
      } else {
        await createExpense(form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{expense ? 'Edit expense' : 'Add an expense'}</DialogTitle>
      <Stack component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              fullWidth
              autoFocus
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              />
              <TextField
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                required
                fullWidth
              >
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Payment method"
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm((f) => ({ ...f, paymentMethod: e.target.value as ExpenseInput['paymentMethod'] }))
                }
                required
                fullWidth
              >
                {PAYMENT_METHODS.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving…' : expense ? 'Save changes' : 'Add expense'}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
