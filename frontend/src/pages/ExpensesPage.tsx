import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useAppDispatch } from '../app/hooks';
import { setPage } from '../features/expenses/filtersSlice';
import { useExpenses } from '../features/expenses/useExpenses';
import { useCategories } from '../features/categories/useCategories';
import ExpenseFilters from '../features/expenses/ExpenseFilters';
import ExpenseFormDialog from '../features/expenses/ExpenseFormDialog';
import CategoryChip from '../components/CategoryChip';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { deleteExpense as deleteExpenseApi } from '../api/expenses';
import { formatCurrency, formatDate } from '../utils/format';
import type { Expense } from '../types';

export default function ExpensesPage() {
  const dispatch = useAppDispatch();
  const { categories } = useCategories();
  const { expenses, pagination, loading, error, refresh } = useExpenses();

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditingExpense(null);
    setFormOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditingExpense(expense);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deletingExpense) return;
    setDeleting(true);
    try {
      await deleteExpenseApi(deletingExpense._id);
      setDeletingExpense(null);
      refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Expenses
        </Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
          Add expense
        </Button>
      </Stack>

      <ExpenseFilters categories={categories} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ overflowX: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
          </Box>
        ) : expenses.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 6, gap: 1 }}>
            <ReceiptLongRoundedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography color="text.secondary">No expenses match your filters yet.</Typography>
          </Box>
        ) : (
          <Table sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {expense.title}
                    </Typography>
                    {expense.notes && (
                      <Typography variant="caption" color="text.secondary">
                        {expense.notes}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <CategoryChip category={expense.category} />
                  </TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 700 }}>{formatCurrency(expense.amount)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(expense)} aria-label="Edit expense">
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeletingExpense(expense)}
                      aria-label="Delete expense"
                    >
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {!loading && expenses.length > 0 && (
        <Pagination pagination={pagination} onPageChange={(p) => dispatch(setPage(p))} />
      )}

      <ExpenseFormDialog
        open={formOpen}
        categories={categories}
        expense={editingExpense}
        onClose={() => setFormOpen(false)}
        onSaved={refresh}
      />

      <ConfirmDialog
        open={!!deletingExpense}
        title="Delete this expense?"
        description={`"${deletingExpense?.title}" will be removed for good. This can't be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingExpense(null)}
      />
    </Box>
  );
}
