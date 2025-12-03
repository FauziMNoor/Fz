import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }) {
  // Direct path to Supabase sign-in
  const signInPath = '/auth/supabase/sign-in';

  return (
    <Button component={RouterLink} href={signInPath} variant="outlined" sx={sx} {...other}>
      Sign in
    </Button>
  );
}
