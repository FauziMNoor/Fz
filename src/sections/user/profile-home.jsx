import { useRef, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { createUserPost, uploadPostImages } from 'src/lib/supabase-client';

import { ProfilePostItem } from './profile-post-item';

// ----------------------------------------------------------------------

export function ProfileHome({
  info,
  posts,
  isPublic = false,
  onPostCreated,
  onEditPost,
  onDeletePost,
}) {
  const { user } = useAuthContext();
  const fileRef = useRef(null);
  const [postMessage, setPostMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      toast.success(`${files.length} file(s) selected`);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files || []);
    const imageFiles = files.filter(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (imageFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...imageFiles]);
      toast.success(`${imageFiles.length} file(s) added`);
    } else {
      toast.error('Please drop image or video files only');
    }
  };

  const handlePostSubmit = async () => {
    if (!postMessage.trim()) {
      toast.error('Please write something to post');
      return;
    }

    if (!user?.id) {
      toast.error('You must be logged in to post');
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload images first if any
      let mediaUrls = [];
      if (selectedFiles.length > 0) {
        toast.info('Uploading images...');
        mediaUrls = await uploadPostImages(user.id, selectedFiles);
      }

      const postData = {
        message: postMessage.trim(),
        media_urls: mediaUrls,
      };

      await createUserPost(user.id, postData);

      toast.success('Post created successfully!');
      setPostMessage('');
      setSelectedFiles([]);

      // Callback to refresh posts if provided
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAbout = () => (
    <Card>
      <CardHeader title="About" />

      <Box
        sx={{
          p: 3,
          gap: 2,
          display: 'flex',
          typography: 'body2',
          flexDirection: 'column',
        }}
      >
        {info.quote && <div>{info.quote}</div>}

        {info.country && (
          <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px' }}>
            <Iconify width={24} icon="mingcute:location-fill" />
            <span>
              Live at
              <Link variant="subtitle2" color="inherit">
                &nbsp;{info.country}
              </Link>
            </span>
          </Box>
        )}

        {info.email && (
          <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px' }}>
            <Iconify width={24} icon="solar:letter-bold" />
            {info.email}
          </Box>
        )}

        {info.phone_number && (
          <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px' }}>
            <Iconify width={24} icon="solar:phone-bold" />
            {info.phone_number}
          </Box>
        )}

        {info.address && (
          <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px' }}>
            <Iconify width={24} icon="solar:map-point-bold" />
            {info.address}
          </Box>
        )}
      </Box>
    </Card>
  );

  const renderPostInput = () => (
    <Card sx={{ p: 3 }}>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={[
          (theme) => ({
            p: 2,
            mb: 2,
            borderRadius: 1,
            border: `dashed 2px ${isDragging ? theme.palette.primary.main : varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
            bgcolor: isDragging
              ? varAlpha(theme.vars.palette.primary.mainChannel, 0.08)
              : 'transparent',
            transition: 'all 0.2s',
          }),
        ]}
      >
        <InputBase
          multiline
          fullWidth
          rows={4}
          value={postMessage}
          onChange={(e) => setPostMessage(e.target.value)}
          placeholder="Share what you are thinking here... (You can drag & drop images here)"
          disabled={isSubmitting}
          inputProps={{ id: 'post-input' }}
        />
      </Box>

      {selectedFiles.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {selectedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: 1,
                overflow: 'hidden',
                border: (theme) =>
                  `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveFile(index)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'error.main', color: 'error.contrastText' },
                }}
              >
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            gap: 1,
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <Fab
            size="small"
            color="inherit"
            variant="softExtended"
            onClick={handleAttach}
            disabled={isSubmitting}
          >
            <Iconify icon="solar:gallery-wide-bold" width={24} sx={{ color: 'success.main' }} />
            Image/Video
          </Fab>

          <Fab size="small" color="inherit" variant="softExtended" disabled>
            <Iconify icon="solar:videocamera-record-bold" width={24} sx={{ color: 'error.main' }} />
            Streaming
          </Fab>
        </Box>

        <Button
          variant="contained"
          onClick={handlePostSubmit}
          disabled={isSubmitting || !postMessage.trim()}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Post'}
        </Button>
      </Box>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Card>
  );

  const renderSocials = () => {
    const socialLinks = [
      { name: 'Facebook', value: info.socialLinks?.facebook, icon: 'socials:facebook' },
      { name: 'Instagram', value: info.socialLinks?.instagram, icon: 'socials:instagram' },
      { name: 'Threads', value: info.socialLinks?.threads, icon: 'ri:threads-fill' },
      { name: 'YouTube', value: info.socialLinks?.youtube, icon: 'socials:youtube' },
    ].filter((social) => social.value); // Only show if has value

    if (socialLinks.length === 0) {
      return null; // Don't show card if no social links
    }

    return (
      <Card>
        <CardHeader title="Social" />

        <Box
          sx={{
            p: 3,
            gap: 2,
            display: 'flex',
            flexDirection: 'column',
            typography: 'body2',
          }}
        >
          {socialLinks.map((social) => (
            <Box
              key={social.name}
              sx={{
                gap: 2,
                display: 'flex',
                lineHeight: '20px',
                wordBreak: 'break-all',
                alignItems: 'flex-start',
              }}
            >
              <Iconify icon={social.icon} width={20} />
              <Link
                href={social.value}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                {social.value}
              </Link>
            </Box>
          ))}
        </Box>
      </Card>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }} sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {renderAbout()}
        {renderSocials()}
      </Grid>

      <Grid size={{ xs: 12, md: 8 }} sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {!isPublic && renderPostInput()}

        {posts.map((post) => (
          <ProfilePostItem
            key={post.id}
            post={post}
            onEdit={onEditPost}
            onDelete={onDeletePost}
            isPublic={isPublic}
            onCommentAdded={onPostCreated}
          />
        ))}
      </Grid>
    </Grid>
  );
}
