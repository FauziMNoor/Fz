import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <AuthSplitLayout
        slotProps={{
          section: {
            title: 'Selamat Datang Kembali',
            subtitle: 'Mari lanjutkan amanah dan kerja terbaik kita dengan penuh keberkahan.',
          },
        }}
      >
        {children}
      </AuthSplitLayout>
    </GuestGuard>
  );
}
