import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import CardContent from '@mui/material/CardContent';

// ----------------------------------------------------------------------

export function EbookSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      {/* Cover Image Skeleton */}
      <Skeleton variant="rectangular" sx={{ paddingTop: '133.33%' }} />

      {/* Content Skeleton */}
      <CardContent>
        <Stack spacing={2}>
          {/* Title */}
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" height={32} width="80%" />

          {/* Author */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={120} />
          </Stack>

          {/* Badges */}
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={100} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Stack>

          {/* Stats */}
          <Stack direction="row" spacing={2}>
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={60} />
          </Stack>

          {/* Button */}
          <Skeleton variant="rounded" height={48} />
        </Stack>
      </CardContent>
    </Card>
  );
}
