import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip } from '@mui/material';
import { formatDate } from '../../utils/format';
import type { AdminInsights } from '../../types';

export default function RecentUsersList({ users }: { users: AdminInsights['recentUsers'] }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Recently registered users
      </Typography>
      {users.length === 0 ? (
        <Typography color="text.secondary">No signups yet.</Typography>
      ) : (
        <List disablePadding>
          {users.map((u) => (
            <ListItem key={u._id} disableGutters>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{u.name[0]?.toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={u.name} secondary={`${u.email} · joined ${formatDate(u.createdAt)}`} />
              {u.role === 'admin' && <Chip label="Admin" size="small" color="secondary" />}
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
