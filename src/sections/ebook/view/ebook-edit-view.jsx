'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { supabase } from 'src/lib/supabase-client';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EbookNewEditForm } from '../ebook-new-edit-form';

// ----------------------------------------------------------------------

export function EbookEditView({ id }) {
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEbook() {
      try {
        const { data, error } = await supabase.from('ebooks').select('*').eq('id', id).single();

        if (error) throw error;

        setEbook(data);
      } catch (error) {
        console.error('Error fetching e-book:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEbook();
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ p: 3, textAlign: 'center' }}>Loading...</Box>
      </DashboardContent>
    );
  }

  if (!ebook) {
    return (
      <DashboardContent>
        <Box sx={{ p: 3, textAlign: 'center' }}>E-Book not found</Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit E-Book"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'E-Books', href: paths.dashboard.ebook.root },
          { name: ebook.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <EbookNewEditForm currentEbook={ebook} />
    </DashboardContent>
  );
}
