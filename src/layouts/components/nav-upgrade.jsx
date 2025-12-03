import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }) {
  const { user } = useAuthContext();

  return (
    <Box
      sx={[{ px: 2, py: 5, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.avatar_url} alt={user?.full_name} sx={{ width: 48, height: 48 }}>
            {user?.full_name?.charAt(0).toUpperCase()}
          </Avatar>

          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            {user?.role === 'admin' ? 'Admin' : 'Free'}
          </Label>
        </Box>

        <Box sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ mb: 1, color: 'var(--layout-nav-text-primary-color)' }}
          >
            {user?.full_name}
          </Typography>

          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            {user?.email}
          </Typography>
        </Box>

        {/* Removed "Upgrade to Pro" button - not needed for personal blog */}
      </Box>
    </Box>
  );
}
