'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import {
  getPublishedEbooks,
  getEbooksByCategory,
  getOwnWorkEbooks,
  getFeaturedEbooks,
  getEbookCategories,
} from 'src/lib/supabase-client';

import { Iconify } from 'src/components/iconify';

import { EbookCard } from './ebook-card';
import { EbookSkeleton } from './ebook-skeleton';

// ----------------------------------------------------------------------

export function EbookListView() {
  const [ebooks, setEbooks] = useState([]);
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ownWorkOnly, setOwnWorkOnly] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getEbookCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Fetch featured e-books
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await getFeaturedEbooks();
        setFeaturedEbooks(data);
      } catch (error) {
        console.error('Error fetching featured e-books:', error);
      }
    }
    fetchFeatured();
  }, []);

  // Fetch e-books based on filters
  const fetchEbooks = useCallback(async () => {
    try {
      setLoading(true);
      let data;

      if (ownWorkOnly) {
        data = await getOwnWorkEbooks();
      } else if (selectedCategory !== 'all') {
        data = await getEbooksByCategory(selectedCategory);
      } else {
        data = await getPublishedEbooks();
      }

      setEbooks(data);
    } catch (error) {
      console.error('Error fetching e-books:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, ownWorkOnly]);

  useEffect(() => {
    fetchEbooks();
  }, [fetchEbooks]);

  // Filter by search query
  const filteredEbooks = ebooks.filter(
    (ebook) =>
      ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.author_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort e-books
  const sortedEbooks = [...filteredEbooks].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.published_at) - new Date(a.published_at);
    }
    if (sortBy === 'popular') {
      return (b.download_count || 0) - (a.download_count || 0);
    }
    if (sortBy === 'az') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
      setOwnWorkOnly(false);
    }
  };

  const handleOwnWorkToggle = () => {
    setOwnWorkOnly(!ownWorkOnly);
    setSelectedCategory('all');
  };

  const handleSortChange = (event, newSort) => {
    if (newSort !== null) {
      setSortBy(newSort);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          📚 Koleksi E-Book
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Kumpulan e-book pilihan tentang Islam, Pendidikan, dan Kepemimpinan
        </Typography>
      </Box>

      {/* Featured Section */}
      {featuredEbooks.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            ⭐ Featured E-Books
          </Typography>
          <Grid container spacing={3}>
            {featuredEbooks.slice(0, 3).map((ebook) => (
              <Grid item xs={12} sm={6} md={4} key={ebook.id}>
                <EbookCard ebook={ebook} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Filters */}
      <Stack spacing={3} sx={{ mb: 5 }}>
        {/* Search & Own Work Toggle */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            placeholder="Cari e-book atau penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-bold" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant={ownWorkOnly ? 'contained' : 'outlined'}
            color="primary"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={handleOwnWorkToggle}
            sx={{ minWidth: 200 }}
          >
            Karya Fauzi M. Noor
          </Button>
        </Stack>

        {/* Category Filter */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Kategori:
          </Typography>
          <ToggleButtonGroup
            value={selectedCategory}
            exclusive
            onChange={handleCategoryChange}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiToggleButton-root': {
                border: 1,
                borderRadius: 1,
              },
            }}
          >
            <ToggleButton value="all">Semua</ToggleButton>
            {categories.map((cat) => (
              <ToggleButton key={cat.slug} value={cat.slug}>
                {cat.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Sort */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2">Urutkan:</Typography>
          <ToggleButtonGroup value={sortBy} exclusive onChange={handleSortChange} size="small">
            <ToggleButton value="latest">Terbaru</ToggleButton>
            <ToggleButton value="popular">Populer</ToggleButton>
            <ToggleButton value="az">A-Z</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Menampilkan {sortedEbooks.length} e-book
        {searchQuery && ` untuk "${searchQuery}"`}
        {ownWorkOnly && ' (Karya Fauzi M. Noor)'}
      </Typography>

      {/* E-Books Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <EbookSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : sortedEbooks.length === 0 ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Iconify icon="solar:book-bold" width={64} sx={{ mb: 2, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            Tidak ada e-book ditemukan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Coba ubah filter atau kata kunci pencarian
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedEbooks.map((ebook) => (
            <Grid item xs={12} sm={6} md={4} key={ebook.id}>
              <EbookCard ebook={ebook} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
