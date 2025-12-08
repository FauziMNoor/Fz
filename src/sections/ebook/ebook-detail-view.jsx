'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fShortenNumber } from 'src/utils/format-number';

import {
  getPublishedEbooks,
  trackEbookDownload,
  incrementEbookViewCount,
} from 'src/lib/supabase-client';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

import { EbookCard } from './ebook-card';

// ----------------------------------------------------------------------

export function EbookDetailView({ ebook }) {
  const [relatedEbooks, setRelatedEbooks] = useState([]);

  // Increment view count on mount
  useEffect(() => {
    if (ebook?.id) {
      incrementEbookViewCount(ebook.id);
    }
  }, [ebook?.id]);

  // Fetch related e-books
  useEffect(() => {
    async function fetchRelated() {
      try {
        const allEbooks = await getPublishedEbooks();
        const related = allEbooks
          .filter((e) => e.id !== ebook.id && e.category === ebook.category)
          .slice(0, 3);
        setRelatedEbooks(related);
      } catch (error) {
        console.error('Error fetching related e-books:', error);
      }
    }

    if (ebook?.id) {
      fetchRelated();
    }
  }, [ebook?.id, ebook?.category]);

  const handleDownload = async () => {
    if (ebook?.id) {
      try {
        await trackEbookDownload(ebook.id);
        window.open(ebook.google_drive_url, '_blank');
      } catch (error) {
        console.error('Error tracking download:', error);
        window.open(ebook.google_drive_url, '_blank');
      }
    }
  };

  if (!ebook) {
    return (
      <Container>
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h4">E-Book tidak ditemukan</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Back Button */}
      <Button
        component={RouterLink}
        href={paths.ebook.root}
        startIcon={<Iconify icon="solar:arrow-left-bold" />}
        sx={{ mb: 3 }}
      >
        Kembali ke Koleksi E-Book
      </Button>

      <Grid container spacing={5}>
        {/* Left Column - Cover & Download */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3} sx={{ position: 'sticky', top: 100 }}>
            {/* Cover Image */}
            <Image
              src={ebook.cover_image_url || '/assets/images/cover/cover-default.webp'}
              alt={ebook.title}
              ratio="3/4"
              sx={{ borderRadius: 2 }}
            />

            {/* Download Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Iconify icon="solar:download-bold" />}
              onClick={handleDownload}
            >
              Download E-Book
            </Button>

            {/* File Info */}
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Format:
                </Typography>
                <Chip label={ebook.file_format || 'PDF'} size="small" />
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Ukuran:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {ebook.file_size || 'N/A'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Downloads:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {fShortenNumber(ebook.download_count || 0)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Views:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {fShortenNumber(ebook.view_count || 0)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>

        {/* Right Column - Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Title */}
            <Typography variant="h3">{ebook.title}</Typography>

            {/* Author */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:user-bold" width={20} color="text.secondary" />
              <Typography variant="h6" color="text.secondary">
                {ebook.author_name}
              </Typography>
            </Stack>

            {/* Badges */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {ebook.is_own_work && (
                <Chip
                  label="Karya Fauzi M. Noor"
                  color="primary"
                  icon={<Iconify icon="solar:pen-bold" />}
                />
              )}
              {ebook.category && (
                <Chip
                  label={ebook.category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  variant="soft"
                  color="info"
                />
              )}
              {ebook.is_featured && <Chip label="Featured" color="warning" />}
            </Stack>

            <Divider />

            {/* Description */}
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Tentang E-Book Ini
              </Typography>
              {ebook.description ? (
                <Markdown children={ebook.description} />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Tidak ada deskripsi tersedia.
                </Typography>
              )}
            </Box>

            {/* Tags */}
            {ebook.tags && ebook.tags.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Tags:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {ebook.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Related E-Books */}
      {relatedEbooks.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            E-Book Terkait
          </Typography>
          <Grid container spacing={3}>
            {relatedEbooks.map((relatedEbook) => (
              <Grid key={relatedEbook.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <EbookCard ebook={relatedEbook} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
