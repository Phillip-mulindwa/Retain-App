import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Collapse,
  Button,
  Paper,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  setSearch,
  setCategory,
  setPaymentMethod,
  setDateRange,
  setAmountRange,
  setSort,
  resetFilters,
} from './filtersSlice';
import { PAYMENT_METHODS } from '../../types';
import type { Category } from '../../types';

// All of search/category/payment method/date/amount/sort is Redux state -
// every control here just dispatches an action; it never holds its own
// copy of the value, so the URL-less "state" of the expenses page lives
// entirely in the store and survives navigating away and back.
export default function ExpenseFilters({ categories }: { categories: Category[] }) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.expenseFilters);
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search title or notes…"
          size="small"
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          sx={{ flexGrow: 1, minWidth: 200 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          size="small"
          label="Category"
          value={filters.category}
          onChange={(e) => dispatch(setCategory(e.target.value))}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Sort by"
          value={`${filters.sortBy}:${filters.sortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split(':') as ['date' | 'amount', 'asc' | 'desc'];
            dispatch(setSort({ sortBy, sortDir }));
          }}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="date:desc">Newest first</MenuItem>
          <MenuItem value="date:asc">Oldest first</MenuItem>
          <MenuItem value="amount:desc">Amount: high to low</MenuItem>
          <MenuItem value="amount:asc">Amount: low to high</MenuItem>
        </TextField>
        <IconButton onClick={() => setExpanded((v) => !v)} color={expanded ? 'primary' : 'default'}>
          <TuneRoundedIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <TextField
            select
            size="small"
            label="Payment method"
            value={filters.paymentMethod}
            onChange={(e) => dispatch(setPaymentMethod(e.target.value as typeof filters.paymentMethod))}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="">Any method</MenuItem>
            {PAYMENT_METHODS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="From"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => dispatch(setDateRange({ dateFrom: e.target.value, dateTo: filters.dateTo }))}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            size="small"
            label="To"
            type="date"
            value={filters.dateTo}
            onChange={(e) => dispatch(setDateRange({ dateFrom: filters.dateFrom, dateTo: e.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            size="small"
            label="Min amount"
            type="number"
            value={filters.amountMin}
            onChange={(e) => dispatch(setAmountRange({ amountMin: e.target.value, amountMax: filters.amountMax }))}
            sx={{ width: 130 }}
          />
          <TextField
            size="small"
            label="Max amount"
            type="number"
            value={filters.amountMax}
            onChange={(e) => dispatch(setAmountRange({ amountMin: filters.amountMin, amountMax: e.target.value }))}
            sx={{ width: 130 }}
          />
          <Button
            startIcon={<RestartAltRoundedIcon />}
            onClick={() => dispatch(resetFilters())}
            color="inherit"
          >
            Reset
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
}
