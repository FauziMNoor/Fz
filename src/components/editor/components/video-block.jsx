import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { toast } from 'src/components/snackbar';

import { editorClasses } from '../classes';
import { ToolbarItem } from './toolbar-item';

// ----------------------------------------------------------------------

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// Helper function to get embed URL from various video platforms
function getVideoEmbedUrl(url) {
  // YouTube
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Dailymotion
  const dailymotionMatch = url.match(/dailymotion\.com\/video\/([^_]+)/);
  if (dailymotionMatch) {
    return `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`;
  }

  // If already an embed URL, return as is
  if (url.includes('/embed/') || url.includes('player.')) {
    return url;
  }

  return null;
}

export function VideoBlock({ editor }) {
  const [url, setUrl] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setUrl('');
  };

  const handleInsertVideo = useCallback(() => {
    if (!url) {
      toast.error('Please enter video URL');
      return;
    }

    const embedUrl = getVideoEmbedUrl(url);

    if (!embedUrl) {
      toast.error('Invalid video URL. Supported: YouTube, Vimeo, Dailymotion');
      return;
    }

    // Insert iframe HTML into editor
    const iframeHtml = `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1rem 0;">
        <iframe
          src="${embedUrl}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `;

    editor?.chain().focus().insertContent(iframeHtml).run();

    toast.success('Video inserted successfully');
    handleClosePopover();
  }, [url, editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <ToolbarItem
        aria-label="Video"
        className={editorClasses.toolbar.video}
        onClick={handleOpenPopover}
        icon={
          <path d="M2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 5V19H16V5H8ZM4 5V7H6V5H4ZM18 5V7H20V5H18ZM4 9V11H6V9H4ZM18 9V11H20V9H18ZM4 13V15H6V13H4ZM18 13V15H20V13H18ZM4 17V19H6V17H4ZM18 17V19H20V17H18Z" />
        }
      />
      <Popover
        id={anchorEl ? 'video-popover' : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 2.5, width: 400 } } }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Embed Video
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Supported: YouTube, Vimeo, Dailymotion
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          sx={{ mb: 2 }}
          helperText="Paste video URL or video ID"
        />

        <Button fullWidth variant="contained" disabled={!url} onClick={handleInsertVideo}>
          Insert Video
        </Button>
      </Popover>
    </>
  );
}
