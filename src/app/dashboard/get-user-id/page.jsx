'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function GetUserIdPage() {
  const { user } = useAuthContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      toast.success('User ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardContent>
      <Container maxWidth="md">
        <Card>
          <CardContent sx={{ p: 5, textAlign: 'center' }}>
            <Iconify icon="solar:user-id-bold" width={64} sx={{ mb: 3, color: 'primary.main' }} />

            <Typography variant="h4" gutterBottom>
              Your User ID
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Copy this ID and paste it to PUBLIC_USER_ID in public-profile-view.jsx
            </Typography>

            {user?.id ? (
              <>
                <Box
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    wordBreak: 'break-all',
                  }}
                >
                  {user.id}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Iconify icon={copied ? 'eva:checkmark-fill' : 'eva:copy-fill'} />}
                  onClick={handleCopy}
                  color={copied ? 'success' : 'primary'}
                >
                  {copied ? 'Copied!' : 'Copy User ID'}
                </Button>

                <Box sx={{ mt: 4, p: 3, bgcolor: 'info.lighter', borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    📝 Next Steps:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                    1. Copy the User ID above
                    <br />
                    2. Open: src/sections/user/view/public-profile-view.jsx
                    <br />
                    3. Find line: const PUBLIC_USER_ID = 'YOUR_USER_ID_HERE';
                    <br />
                    4. Replace with: const PUBLIC_USER_ID = '{user.id}';
                    <br />
                    5. Save and visit: /tentang-saya
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography color="error">Please login first</Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </DashboardContent>
  );
}
