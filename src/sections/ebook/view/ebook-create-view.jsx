'use client';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EbookNewEditForm } from '../ebook-new-edit-form';

// ----------------------------------------------------------------------

export function EbookCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create E-Book"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'E-Books', href: paths.dashboard.ebook.root },
          { name: 'New E-Book' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <EbookNewEditForm />
    </DashboardContent>
  );
}
