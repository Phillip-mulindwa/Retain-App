import { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useCategories } from '../categories/useCategories';
import { deleteCategory } from '../../api/categories';
import { extractErrorMessage } from '../../api/client';
import ConfirmDialog from '../../components/ConfirmDialog';
import CategoryFormDialog from './CategoryFormDialog';
import type { Category } from '../../types';

// Admins manage the shared category list from here. Deleting one that
// still has expenses attached reassigns them to Uncategorized on the
// backend - the success message below surfaces exactly how many moved,
// so nothing feels like it silently vanished.
export default function CategoryManager() {
  const { categories, loading, reload } = useCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function confirmDelete() {
    if (!deleting) return;
    setWorking(true);
    setError('');
    try {
      const { reassignedExpenses } = await deleteCategory(deleting._id);
      setNotice(
        reassignedExpenses > 0
          ? `Deleted "${deleting.name}" - ${reassignedExpenses} expense(s) moved to Uncategorized.`
          : `Deleted "${deleting.name}".`
      );
      setDeleting(null);
      reload();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setWorking(false);
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Categories
        </Typography>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          New category
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setNotice('')}>
          {notice}
        </Alert>
      )}

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              categories.map((cat) => (
                <TableRow key={cat._id} hover>
                  <TableCell>
                    <Chip
                      label={cat.isDefault ? `${cat.name} (default)` : cat.name}
                      size="small"
                      sx={{ bgcolor: `${cat.color}22`, color: cat.color, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditing(cat);
                        setFormOpen(true);
                      }}
                    >
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      disabled={cat.isDefault}
                      title={cat.isDefault ? "The default category can't be deleted" : undefined}
                      onClick={() => setDeleting(cat)}
                    >
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

      <CategoryFormDialog
        open={formOpen}
        category={editing}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete this category?"
        description={`Any expenses in "${deleting?.name}" will move to Uncategorized. This can't be undone.`}
        loading={working}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </Paper>
  );
}
