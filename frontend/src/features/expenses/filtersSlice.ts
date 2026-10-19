import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaymentMethod } from '../../types';

// Every piece of expense search/filter/sort/pagination state lives here
// and ONLY here - this is the "Redux strictly for filtering" boundary
// the spec draws. The expenses themselves (the actual data returned by
// the API) are never put in this store; they stay in component state,
// fetched fresh whenever this slice changes. That keeps Redux and
// Context from ever overlapping in what they're responsible for.
export interface ExpenseFiltersState {
  search: string;
  category: string; // category id, '' = all
  paymentMethod: PaymentMethod | '';
  dateFrom: string; // ISO date, '' = unset
  dateTo: string;
  amountMin: string; // kept as string so an empty field isn't coerced to 0
  amountMax: string;
  sortBy: 'date' | 'amount';
  sortDir: 'asc' | 'desc';
  page: number;
  limit: number;
}

const initialState: ExpenseFiltersState = {
  search: '',
  category: '',
  paymentMethod: '',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  sortBy: 'date',
  sortDir: 'desc',
  page: 1,
  limit: 10,
};

const expenseFiltersSlice = createSlice({
  name: 'expenseFilters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1; // any filter change resets back to page 1
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.page = 1;
    },
    setPaymentMethod(state, action: PayloadAction<PaymentMethod | ''>) {
      state.paymentMethod = action.payload;
      state.page = 1;
    },
    setDateRange(state, action: PayloadAction<{ dateFrom: string; dateTo: string }>) {
      state.dateFrom = action.payload.dateFrom;
      state.dateTo = action.payload.dateTo;
      state.page = 1;
    },
    setAmountRange(state, action: PayloadAction<{ amountMin: string; amountMax: string }>) {
      state.amountMin = action.payload.amountMin;
      state.amountMax = action.payload.amountMax;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<{ sortBy: 'date' | 'amount'; sortDir: 'asc' | 'desc' }>) {
      state.sortBy = action.payload.sortBy;
      state.sortDir = action.payload.sortDir;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSearch,
  setCategory,
  setPaymentMethod,
  setDateRange,
  setAmountRange,
  setSort,
  setPage,
  resetFilters,
} = expenseFiltersSlice.actions;

export default expenseFiltersSlice.reducer;
