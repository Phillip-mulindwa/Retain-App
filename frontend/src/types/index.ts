// Shared types used across the API layer, Redux slice, Context and every
// component that touches expense/budget/category/user data. Keeping these
// in one place is what lets the rest of the app stay strictly typed.

export type Role = 'user' | 'admin';

export type PaymentMethod = 'Cash' | 'Card' | 'Mobile Money' | 'Bank Transfer' | 'Other';

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Card',
  'Mobile Money',
  'Bank Transfer',
  'Other',
];

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  isDefault: boolean;
  createdBy?: string;
}

// The nested shape the API returns when it populates an expense's
// category (only the fields the UI actually needs, not the full doc).
export interface CategoryRef {
  _id: string;
  name: string;
  color: string;
}

export interface Expense {
  _id: string;
  user: string;
  title: string;
  amount: number;
  category: CategoryRef;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

// What the create/update form sends - category is just an id at that point.
export interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Budget {
  _id: string;
  user: string;
  month: string; // "YYYY-MM"
  limit: number;
}

export type BudgetStatus = 'within' | 'approaching' | 'over';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategorySpend {
  categoryId: string;
  name: string;
  color: string;
  total: number;
  count: number;
}

export interface DashboardSummary {
  month: string;
  totalSpent: number;
  limit: number | null;
  remaining: number | null;
  status: BudgetStatus | null;
  highestExpense: Expense | null;
  byCategory: CategorySpend[];
  recentExpenses: Expense[];
}

export interface AdminInsights {
  totalUsers: number;
  totalExpenses: number;
  totalValue: number;
  expensesThisMonth: number;
  spendingPerCategory: CategorySpend[];
  topCategories: CategorySpend[];
  bottomCategories: CategorySpend[];
  recentExpenses: Expense[];
  recentUsers: Pick<User, '_id' | 'name' | 'email' | 'role' | 'createdAt'>[];
}

export interface ApiError {
  message: string;
}
