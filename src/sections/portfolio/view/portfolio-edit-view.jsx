'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { supabase } from 'src/lib/supabase-client';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PortfolioNewEditForm } from '../portfolio-new-edit-form';

// ----------------------------------------------------------------------

export function PortfolioEditView({ id }) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data, error } = await supabase.from('portfolios').select('*').eq('id', id).single();

        if (error) throw error;
        setPortfolio(data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPortfolio();
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Iconify icon="svg-spinners:8-dots-rotate" width={48} />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Portfolio"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Portfolio', href: paths.dashboard.portfolio.root },
          { name: portfolio?.title || 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PortfolioNewEditForm currentPortfolio={portfolio} />
    </DashboardContent>
  );
}
