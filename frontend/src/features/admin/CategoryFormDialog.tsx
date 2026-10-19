import { useEffect, useState, type FormEvent } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Alert, Box } from '@mui/material';
import { createCategory, updateCategory } from '../../api/categories';
import { extractErrorMessage } from '../../api/client';
import type { Category } from '../../types';

interface Props {
  open: boolean;
  category: Category | null; // null = creating
  onClose: () => void;
  onSaved: () => void;
}

const DEFAULT_COLOR = '#0f766e';

export default function CategoryFormDialog({ open, category, onClose, onSaved }: Props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(category?.name || '');
    setColor(category?.color || DEFAULT_COLOR);
    setError('');
  }, [category, open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (category) {
        await updateCategory(category._id, { name, color });
      } else {
        await createCategory(name, color);
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{category ? 'Edit category' : 'New category'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <TextField
                label="Colour"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                sx={{ width: 100 }}
              />
              <Box
                sx={{
                  flexGrow: 1,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: `${color}22`,
                  border: `1px solid ${color}55`,
                  color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {name || 'Preview'}
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
