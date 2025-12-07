import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fShortenNumber } from 'src/utils/format-number';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function EbookCard({ ebook }) {
  const {
    id,
    title,
    slug,
    author_name,
    is_own_work,
    category,
    cover_image_url,
    file_format,
    file_size,
    download_count,
    view_count,
  } = ebook;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.z24,
        },
      }}
    >
      {/* Cover Image */}
      <Box sx={{ position: 'relative' }}>
        <Image
          src={cover_image_url || '/assets/images/cover/cover-default.webp'}
          alt={title}
          ratio="3/4"
          sx={{
            borderRadius: 0,
          }}
        />

        {/* Featured Badge */}
        {ebook.is_featured && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              typography: 'caption',
              fontWeight: 'bold',
            }}
          >
            Featured
          </Box>
        )}

        {/* File Format Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            bgcolor: 'background.paper',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Iconify icon="solar:document-bold" width={16} />
          <Typography variant="caption" fontWeight="bold">
            {file_format || 'PDF'}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: 48,
          }}
        >
          {title}
        </Typography>

        {/* Author */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              bgcolor: is_own_work ? 'primary.main' : 'grey.500',
            }}
          >
            <Iconify icon="solar:user-bold" width={14} />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {author_name}
          </Typography>
        </Stack>

        {/* Own Work Badge */}
        {is_own_work && (
          <Chip
            label="Karya Fauzi M. Noor"
            size="small"
            color="primary"
            icon={<Iconify icon="solar:pen-bold" width={16} />}
            sx={{ width: 'fit-content' }}
          />
        )}

        {/* Category */}
        {category && (
          <Chip
            label={category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            size="small"
            variant="soft"
            color="info"
            sx={{ width: 'fit-content' }}
          />
        )}

        {/* File Info & Stats */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 'auto' }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:file-bold" width={16} color="text.secondary" />
            <Typography variant="caption" color="text.secondary">
              {file_size || 'N/A'}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:eye-bold" width={16} color="text.secondary" />
            <Typography variant="caption" color="text.secondary">
              {fShortenNumber(view_count || 0)}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:download-bold" width={16} color="text.secondary" />
            <Typography variant="caption" color="text.secondary">
              {fShortenNumber(download_count || 0)}
            </Typography>
          </Stack>
        </Stack>

        {/* Action Button */}
        <Button
          component={RouterLink}
          href={paths.ebook.details(slug)}
          variant="contained"
          size="large"
          fullWidth
          startIcon={<Iconify icon="solar:eye-bold" />}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
