'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import { getUserPortfolios, deletePortfolio } from 'src/lib/supabase-client';

import { ProfilePortfolio } from 'src/sections/user/profile-portfolio';

// ----------------------------------------------------------------------

export function PortfolioListView() {
  const { user } = useAuthContext();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolios = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getUserPortfolios(user.id);
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast.error('Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const handleEdit = useCallback((portfolio) => {
    window.location.href = paths.dashboard.portfolio.edit(portfolio.id);
  }, []);

  const handleDelete = useCallback(
    async (portfolio) => {
      if (!window.confirm(`Are you sure you want to delete "${portfolio.title}"?`)) {
        return;
      }

      try {
        await deletePortfolio(portfolio.id);
        toast.success('Portfolio deleted successfully!');
        fetchPortfolios(); // Refresh list
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        toast.error('Failed to delete portfolio');
      }
    },
    [fetchPortfolios]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Portfolio"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Portfolio', href: paths.dashboard.portfolio.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.portfolio.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Portfolio
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {loading ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Iconify icon="svg-spinners:8-dots-rotate" width={48} />
        </Box>
      ) : (
        <ProfilePortfolio
          portfolios={portfolios}
          isOwner
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </DashboardContent>
  );
}
