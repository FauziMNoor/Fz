import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { PostItemSkeleton } from './post-skeleton';
import { PostItemHorizontal } from './post-item-horizontal';

// ----------------------------------------------------------------------

export function PostListHorizontal({ posts = [], loading, onDelete }) {
  const renderLoading = () => <PostItemSkeleton variant="horizontal" />;

  const renderList = () => {
    if (!posts || posts.length === 0) {
      return (
        <Box sx={{ py: 10, textAlign: 'center', gridColumn: '1 / -1' }}>
          <Box sx={{ mb: 2, fontSize: 48 }}>📝</Box>
          <Box sx={{ typography: 'h6', mb: 1 }}>Belum ada artikel</Box>
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            Klik tombol &quot;New post&quot; untuk membuat artikel pertama
          </Box>
        </Box>
      );
    }

    return posts.map((post) => (
      <PostItemHorizontal
        key={post.id}
        post={post}
        detailsHref={paths.dashboard.post.details(post.slug || post.title)}
        editHref={paths.dashboard.post.edit(post.slug || post.title)}
        onDelete={onDelete}
      />
    ));
  };

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        }}
      >
        {loading ? renderLoading() : renderList()}
      </Box>

      {posts.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
