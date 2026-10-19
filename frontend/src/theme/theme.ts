import { createTheme } from '@mui/material/styles';

// Retain's palette: a deep emerald/teal as the primary action colour
// (money, growth, "staying within budget"), a warm amber as the
// secondary accent, and clear semantic colours for budget status so
// "within / approaching / over" reads instantly without a legend.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
      light: '#14b8a6',
      dark: '#0b4f4a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#b45309',
      contrastText: '#1f2937',
    },
    success: { main: '#16a34a' },
    warning: { main: '#f59e0b' },
    error: { main: '#dc2626' },
    background: {
      default: '#f4f7f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#52606d',
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 18 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(15, 118, 110, 0.08)',
          border: '1px solid rgba(15, 118, 110, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

// Colours for the three budget states - reused by the budget panel,
// the dashboard stat card and anywhere else a status needs to read at
// a glance.
export const budgetStatusColors: Record<'within' | 'approaching' | 'over', string> = {
  within: '#16a34a',
  approaching: '#f59e0b',
  over: '#dc2626',
};
