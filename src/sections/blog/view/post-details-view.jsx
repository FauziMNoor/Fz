'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { paths } from 'src/routes/paths';

import { fShortenNumber } from 'src/utils/format-number';

import { POST_PUBLISH_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

import { PostDetailsHero } from '../post-details-hero';
import { PostCommentList } from '../post-comment-list';
import { PostCommentForm } from '../post-comment-form';
import { PostDetailsToolbar } from '../post-details-toolbar';

// ----------------------------------------------------------------------

export function PostDetailsView({ post }) {
  const [publish, setPublish] = useState('');

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  // Map database fields to component fields
  const mappedPost = post
    ? {
        ...post,
        title: post.title,
        description: post.description,
        content: post.content,
        coverUrl: post.cover_url || post.coverUrl || '/assets/images/cover/cover-1.webp',
        publish: post.status || post.publish || 'draft',
        tags: post.tags || [],
        comments: post.comments || [],
        favoritePerson: post.favoritePerson || [],
        totalViews: post.view_count || post.totalViews || 0,
        totalShares: post.share_count || post.totalShares || 0,
        totalComments: post.comment_count || post.totalComments || 0,
        totalFavorites: post.favorite_count || post.totalFavorites || 0,
      }
    : null;

  useEffect(() => {
    if (mappedPost) {
      setPublish(mappedPost.publish);
    }
  }, [mappedPost]);

  return (
    <DashboardContent maxWidth={false} disablePadding>
      <Container maxWidth={false} sx={{ px: { sm: 5 } }}>
        <PostDetailsToolbar
          backHref={paths.dashboard.post.root}
          editHref={paths.dashboard.post.edit(post?.slug || post?.title)}
          liveHref={paths.post.details(post?.slug || post?.title)}
          publish={`${publish}`}
          onChangePublish={handleChangePublish}
          publishOptions={POST_PUBLISH_OPTIONS}
        />
      </Container>

      <PostDetailsHero title={mappedPost?.title} coverUrl={mappedPost?.coverUrl} />

      <Box
        sx={{
          pb: 5,
          mx: 'auto',
          maxWidth: 720,
          mt: { xs: 5, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="subtitle1">{mappedPost?.description}</Typography>

        <Markdown children={mappedPost?.content} />

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
            {mappedPost?.tags && mappedPost.tags.length > 0 ? (
              mappedPost.tags.map((tag) => <Chip key={tag} label={tag} variant="soft" />)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No tags
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              label={fShortenNumber(post?.totalFavorites)}
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

            {mappedPost?.favoritePerson && mappedPost.favoritePerson.length > 0 && (
              <AvatarGroup sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 32, height: 32 } }}>
                {mappedPost.favoritePerson.map((person) => (
                  <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
                ))}
              </AvatarGroup>
            )}
          </Box>
        </Stack>

        <Box sx={{ mb: 3, mt: 5, display: 'flex' }}>
          <Typography variant="h4">Comments</Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            ({mappedPost?.comments?.length || 0})
          </Typography>
        </Box>

        <PostCommentForm />

        <Divider sx={{ mt: 5, mb: 2 }} />

        <PostCommentList comments={mappedPost?.comments || []} />
      </Box>
    </DashboardContent>
  );
}
