'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { fShortenNumber } from 'src/utils/format-number';
import { getPostComments, incrementPostViews } from 'src/lib/supabase-client';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostItem } from '../post-item';
import { PostCommentList } from '../post-comment-list';
import { PostCommentForm } from '../post-comment-form';
import { PostDetailsHero } from '../post-details-hero';

// ----------------------------------------------------------------------

export function PostDetailsHomeView({ post, latestPosts }) {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [viewCount, setViewCount] = useState(post?.view_count || 0);

  const fetchComments = useCallback(async () => {
    if (!post?.id) return;

    try {
      setCommentsLoading(true);
      const data = await getPostComments(post.id);
      setComments(data || []);
    } catch (error) {
      toast.error('Gagal memuat komentar');
    } finally {
      setCommentsLoading(false);
    }
  }, [post?.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Increment view count on mount
  useEffect(() => {
    if (post?.id) {
      incrementPostViews(post.id).then((newCount) => {
        if (newCount) {
          setViewCount(newCount);
        }
      });
    }
  }, [post?.id]);

  const handleCommentAdded = useCallback(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <>
      <PostDetailsHero
        title={post?.title ?? ''}
        author={post?.author}
        coverUrl={post?.cover_url || post?.coverUrl || ''}
        createdAt={post?.created_at || post?.createdAt}
        postUrl={typeof window !== 'undefined' ? window.location.href : ''}
        viewCount={viewCount}
      />

      <Container
        maxWidth={false}
        sx={[
          (theme) => ({ py: 3, mb: 5, borderBottom: `solid 1px ${theme.vars.palette.divider}` }),
        ]}
      >
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: paths.post.root },
            { name: post?.title },
          ]}
          sx={{ maxWidth: 720, mx: 'auto' }}
        />
      </Container>

      <Container maxWidth={false}>
        <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
          {/* Description - Styled as lead paragraph */}
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              fontSize: { xs: '0.95rem', md: '1rem' },
              fontWeight: 400,
              lineHeight: 1.7,
              color: 'text.secondary',
              fontStyle: 'italic',
              borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
              pl: 3,
              py: 2,
              bgcolor: (theme) => theme.palette.action.hover,
              borderRadius: 1,
            }}
          >
            {post?.description}
          </Typography>

          <Markdown children={post?.content} />

          <Stack
            spacing={3}
            sx={[
              (theme) => ({
                py: 3,
                borderTop: `dashed 1px ${theme.vars.palette.divider}`,
                borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
              }),
            ]}
          >
            <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
              {post?.tags && post.tags.length > 0 ? (
                post.tags.map((tag) => <Chip key={tag} label={tag} variant="soft" />)
              ) : (
                <Chip label="No tags" variant="soft" color="default" />
              )}
            </Box>

            {/* Likes/Favorites - Hidden for now (not implemented in database) */}
            {post?.totalFavorites > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  label={fShortenNumber(post?.totalFavorites || 0)}
                  control={
                    <Checkbox
                      defaultChecked
                      size="small"
                      color="error"
                      icon={<Iconify icon="solar:heart-bold" />}
                      checkedIcon={<Iconify icon="solar:heart-bold" />}
                      slotProps={{
                        input: {
                          id: 'favorite-checkbox',
                          'aria-label': 'Favorite checkbox',
                        },
                      }}
                    />
                  }
                  sx={{ mr: 1 }}
                />

                {post?.favoritePerson && post.favoritePerson.length > 0 && (
                  <AvatarGroup>
                    {post.favoritePerson.map((person) => (
                      <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
                    ))}
                  </AvatarGroup>
                )}
              </Box>
            )}
          </Stack>

          <Box sx={{ mb: 3, mt: 5, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="h4">Comments</Typography>

            <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
              ({comments.length})
            </Typography>
          </Box>

          <PostCommentForm postId={post?.id} onCommentAdded={handleCommentAdded} />

          <Divider sx={{ mt: 5, mb: 2 }} />

          {commentsLoading ? (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}
            >
              Memuat komentar...
            </Typography>
          ) : (
            <PostCommentList comments={comments} />
          )}
        </Stack>
      </Container>

      {!!latestPosts?.length && (
        <Container sx={{ pb: 15 }}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Recent Posts
          </Typography>

          <Grid container spacing={3}>
            {latestPosts?.slice(latestPosts.length - 4).map((latestPost) => (
              <Grid
                key={latestPost.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >
                <PostItem post={latestPost} detailsHref={paths.post.details(latestPost.title)} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
}
