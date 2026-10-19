import { List, ListItem, ListItemText, Typography, Paper, Box } from '@mui/material';
import CategoryChip from './CategoryChip';
import { formatCurrency, formatDate } from '../utils/format';
import type { Expense } from '../types';

export default function RecentExpensesList({ expenses }: { expenses: Expense[] }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Recent expenses
      </Typography>
      {expenses.length === 0 ? (
        <Typography color="text.secondary">Nothing logged yet.</Typography>
      ) : (
        <List disablePadding>
          {expenses.map((expense) => (
            <ListItem key={expense._id} disableGutters sx={{ py: 1 }}>
              <ListItemText
                primary={expense.title}
                secondary={formatDate(expense.date)}
                sx={{ mr: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                <CategoryChip category={expense.category} />
                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(expense.amount)}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
