import { configureStore } from '@reduxjs/toolkit';
import expenseFiltersReducer from '../features/expenses/filtersSlice';

// Redux's entire job in this app is holding expense filter/search/sort
// state - nothing else goes in here. Auth lives in Context instead
// (see features/auth/AuthContext.tsx), by design.
export const store = configureStore({
  reducer: {
    expenseFilters: expenseFiltersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
