import { varAlpha } from 'minimal-shared/utils';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemText from '@mui/material/ListItemText';

import { fDateTime } from 'src/utils/format-time';

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

  // Share menu state
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const shareMenuOpen = Boolean(shareAnchorEl);

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

  const handleOpenShareMenu = useCallback((event) => {
    setShareAnchorEl(event.currentTarget);
  }, []);

  const handleCloseShareMenu = useCallback(() => {
    setShareAnchorEl(null);
  }, []);

  const handleShare = useCallback(
    (platform) => {
      const postUrl = window.location.href;
      const postText = post.message || 'Check out this post!';
      const encodedUrl = encodeURIComponent(postUrl);
      const encodedText = encodeURIComponent(postText);

      let shareUrl = '';

      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
          break;
        case 'threads':
          shareUrl = `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
          break;
        case 'telegram':
          shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
          break;
        case 'copy':
          navigator.clipboard.writeText(postUrl);
          toast.success('Link copied to clipboard!');
          handleCloseShareMenu();
          return;
        default:
          break;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        handleCloseShareMenu();
      }
    },
    [post.message, handleCloseShareMenu]
  );

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
      <Box sx={{ flexGrow: 1 }} />

      <IconButton onClick={handleClickComment}>
        <Iconify icon="solar:chat-round-dots-bold" />
      </IconButton>

      <IconButton onClick={handleOpenShareMenu}>
        <Iconify icon="solar:share-bold" />
      </IconButton>
    </Box>
  );

  const renderShareMenu = () => (
    <Menu
      anchorEl={shareAnchorEl}
      open={shareMenuOpen}
      onClose={handleCloseShareMenu}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={() => handleShare('facebook')}>
        <ListItemIcon>
          <Iconify icon="logos:facebook" width={24} />
        </ListItemIcon>
        <ListItemText>Share to Facebook</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleShare('twitter')}>
        <ListItemIcon>
          <Iconify icon="skill-icons:twitter" width={24} />
        </ListItemIcon>
        <ListItemText>Share to X (Twitter)</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleShare('threads')}>
        <ListItemIcon>
          <Iconify icon="ri:threads-fill" width={24} />
        </ListItemIcon>
        <ListItemText>Share to Threads</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleShare('linkedin')}>
        <ListItemIcon>
          <Iconify icon="skill-icons:linkedin" width={24} />
        </ListItemIcon>
        <ListItemText>Share to LinkedIn</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleShare('whatsapp')}>
        <ListItemIcon>
          <Iconify icon="logos:whatsapp-icon" width={24} />
        </ListItemIcon>
        <ListItemText>Share to WhatsApp</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleShare('telegram')}>
        <ListItemIcon>
          <Iconify icon="logos:telegram" width={24} />
        </ListItemIcon>
        <ListItemText>Share to Telegram</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => handleShare('copy')}>
        <ListItemIcon>
          <Iconify icon="solar:copy-bold" width={24} />
        </ListItemIcon>
        <ListItemText>Copy Link</ListItemText>
      </MenuItem>
    </Menu>
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

      {renderShareMenu()}

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
