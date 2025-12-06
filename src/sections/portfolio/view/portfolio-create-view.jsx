'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PortfolioNewEditForm } from '../portfolio-new-edit-form';

// ----------------------------------------------------------------------

export function PortfolioCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Portfolio"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Portfolio', href: paths.dashboard.portfolio.root },
          { name: 'New' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PortfolioNewEditForm />
    </DashboardContent>
  );
}
