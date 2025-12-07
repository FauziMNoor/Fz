import { varAlpha } from 'minimal-shared/utils';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { fDateTime } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { addPostComment } from 'src/lib/supabase-client';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Lightbox, useLightBox } from 'src/components/lightbox';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function ProfilePostItem({ post, onEdit, onDelete, isPublic = false, onCommentAdded }) {
  const { user } = useAuthContext();

  const commentRef = useRef(null);
  const fileRef = useRef(null);

  const [message, setMessage] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Guest comment fields
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // Lightbox for images
  const slides = (post.media_urls || []).map((url) => ({ src: url }));
  const lightbox = useLightBox(slides);

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleClickComment = useCallback(() => {
    if (commentRef.current) {
      commentRef.current.focus();
    }
  }, []);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(post);
    }
  }, [post, onEdit]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(post);
    }
  }, [post, onDelete]);

  const handleSubmitComment = useCallback(async () => {
    if (!message.trim()) {
      toast.error('Please write a comment');
      return;
    }

    // For public pages, require guest info if not logged in
    if (isPublic && !user?.id) {
      if (!guestName.trim()) {
        toast.error('Please enter your name');
        return;
      }
      if (!guestEmail.trim() || !guestEmail.includes('@')) {
        toast.error('Please enter a valid email');
        return;
      }
    }

    // For non-public pages, require login
    if (!isPublic && !user?.id) {
      toast.error('Please login to comment');
      return;
    }

    try {
      setIsSubmittingComment(true);

      if (user?.id) {
        // Logged in user
        await addPostComment(post.id, user.id, message.trim());
      } else {
        // Guest user (public page only)
        await addPostComment(post.id, null, message.trim(), guestName.trim(), guestEmail.trim());
      }

      toast.success('Comment submitted! It will appear after approval.');
      setMessage('');
      setGuestName('');
      setGuestEmail('');

      // Callback to refresh post with new comment
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  }, [message, user, post.id, onCommentAdded, isPublic, guestName, guestEmail]);

  const isOwner = user?.id === post.user_id;

  const renderHead = () => {
    const authorName = post.author?.full_name || user?.displayName || 'Anonymous';
    const authorAvatar = post.author?.avatar_url || user?.photoURL;

    return (
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={authorAvatar} alt={authorName}>
            {authorName?.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Link color="inherit" variant="subtitle1">
            {authorName}
          </Link>
        }
        subheader={
          <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
            {fDateTime(post.created_at || post.createdAt)}
          </Box>
        }
        action={
          !isPublic &&
          isOwner && (
            <Box>
              <IconButton onClick={handleEdit}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
              <IconButton onClick={handleDelete} color="error">
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Box>
          )
        }
      />
    );
  };

  const renderCommentList = () => {
    // Only show approved comments in the comment list
    const approvedComments = (post.comments || []).filter(
      (comment) => comment.status === 'approved'
    );

    if (approvedComments.length === 0) {
      return null;
    }

    return (
      <Stack spacing={1.5} sx={{ px: 3, pb: 2 }}>
        {approvedComments.map((comment) => {
          // Get commenter name (from author profile or guest name)
          const commenterName = comment.author?.name || comment.guest_name || 'User';
          const isGuest = !comment.author && comment.guest_name;

          return (
            <Box key={comment.id} sx={{ gap: 2, display: 'flex' }}>
              <Avatar alt={commenterName} src={comment.author?.avatarUrl}>
                {!comment.author?.avatarUrl && commenterName.charAt(0).toUpperCase()}
              </Avatar>

              <Paper
                sx={{
                  p: 1.5,
                  flexGrow: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Box
                  sx={{
                    mb: 0.5,
                    display: 'flex',
                    alignItems: { sm: 'center' },
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ typography: 'subtitle2' }}>
                      {commenterName}
                      {isGuest && (
                        <Box
                          component="span"
                          sx={{
                            ml: 0.5,
                            typography: 'caption',
                            color: 'text.disabled',
                            fontWeight: 'normal',
                          }}
                        >
                          (Guest)
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
                    {fDateTime(comment.created_at || comment.createdAt)}
                  </Box>
                </Box>

                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>{comment.message}</Box>
              </Paper>
            </Box>
          );
        })}
      </Stack>
    );
  };

  const renderInput = () => {
    const showGuestForm = isPublic && !user?.id;

    return (
      <Box sx={(theme) => ({ p: theme.spacing(0, 3, 3, 3) })}>
        {/* Guest info form for public pages */}
        {showGuestForm && (
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <InputBase
              placeholder="Your name *"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={isSubmittingComment}
              sx={[
                (theme) => ({
                  flex: 1,
                  pl: 1.5,
                  height: 40,
                  borderRadius: 1,
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
                }),
              ]}
            />
            <InputBase
              placeholder="Your email *"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              disabled={isSubmittingComment}
              sx={[
                (theme) => ({
                  flex: 1,
                  pl: 1.5,
                  height: 40,
                  borderRadius: 1,
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
                }),
              ]}
            />
          </Box>
        )}

        {/* Comment input */}
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar src={user?.photoURL} alt={user?.displayName || guestName}>
            {(user?.displayName || guestName || 'G')?.charAt(0).toUpperCase()}
          </Avatar>

          <InputBase
            fullWidth
            value={message}
            inputRef={commentRef}
            placeholder="Write a comment…"
            onChange={handleChangeMessage}
            disabled={isSubmittingComment}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
            endAdornment={
              <InputAdornment position="end" sx={{ mr: 1 }}>
                <IconButton
                  size="small"
                  onClick={handleSubmitComment}
                  disabled={isSubmittingComment || !message.trim()}
                  color="primary"
                >
                  <Iconify icon="solar:plain-2-bold" />
                </IconButton>
              </InputAdornment>
            }
            inputProps={{
              id: `comment-${post.id}-input`,
              'aria-label': `Comment ${post.id} input`,
            }}
            sx={[
              (theme) => ({
                pl: 1.5,
                height: 40,
                borderRadius: 1,
                border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
              }),
            ]}
          />

          <input type="file" ref={fileRef} style={{ display: 'none' }} />
        </Box>
      </Box>
    );
  };

  const renderActions = () => (
    <Box
      sx={[(theme) => ({ display: 'flex', alignItems: 'center', p: theme.spacing(2, 3, 3, 3) })]}
    >
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked
            color="error"
            icon={<Iconify icon="solar:heart-bold" />}
            checkedIcon={<Iconify icon="solar:heart-bold" />}
            slotProps={{
              input: {
                id: `favorite-${post.id}-checkbox`,
                'aria-label': `Favorite ${post.id} checkbox`,
              },
            }}
          />
        }
        label={fShortenNumber(post.personLikes?.length || 0)}
        sx={{ mr: 1 }}
      />

      {!!post.personLikes?.length && (
        <AvatarGroup sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 32, height: 32 } }}>
          {post.personLikes.map((person) => (
            <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
          ))}
        </AvatarGroup>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <IconButton onClick={handleClickComment}>
        <Iconify icon="solar:chat-round-dots-bold" />
      </IconButton>

      <IconButton>
        <Iconify icon="solar:share-bold" />
      </IconButton>
    </Box>
  );

  return (
    <>
      <Card>
        {renderHead()}

        <Typography variant="body2" sx={[(theme) => ({ p: theme.spacing(3, 3, 2, 3) })]}>
          {post.message}
        </Typography>

        {/* Display media from media_urls array */}
        {post.media_urls && post.media_urls.length > 0 && (
          <Box sx={{ p: 1, display: 'flex', gap: 1, flexDirection: 'column' }}>
            {post.media_urls.map((url, index) => (
              <Box
                key={index}
                onClick={() => lightbox.onOpen(url)}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                <img
                  src={url}
                  alt={`media-${index}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    display: 'block',
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Fallback for old posts with single media field */}
        {post.media && !post.media_urls && (
          <Box sx={{ p: 1 }}>
            <Image alt={post.media} src={post.media} ratio="16/9" sx={{ borderRadius: 1.5 }} />
          </Box>
        )}

        {!isPublic && renderActions()}
        {!isPublic && !!(post.comments || []).length && renderCommentList()}
        {!isPublic && renderInput()}
      </Card>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
