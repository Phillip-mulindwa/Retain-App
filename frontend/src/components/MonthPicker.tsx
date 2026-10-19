import { IconButton, Stack, Typography } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { monthLabel } from '../utils/format';

interface Props {
  month: string; // "YYYY-MM"
  onChange: (month: string) => void;
}

// Steps a "YYYY-MM" string one month at a time - every page that's
// scoped to a month (budget, dashboard) uses this same control so
// "previous/next month" behaves identically everywhere.
export default function MonthPicker({ month, onChange }: Props) {
  function shift(delta: number) {
    const [year, mon] = month.split('-').map(Number);
    const next = new Date(year, mon - 1 + delta, 1);
    onChange(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
  }

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <IconButton onClick={() => shift(-1)} size="small" aria-label="Previous month">
        <ChevronLeftRoundedIcon />
      </IconButton>
      <Typography sx={{ fontWeight: 600, minWidth: 140, textAlign: 'center' }}>{monthLabel(month)}</Typography>
      <IconButton onClick={() => shift(1)} size="small" aria-label="Next month">
        <ChevronRightRoundedIcon />
      </IconButton>
    </Stack>
  );
}
