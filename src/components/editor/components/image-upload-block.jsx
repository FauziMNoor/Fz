import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { uploadPostImage } from 'src/lib/supabase-client';

import { editorClasses } from '../classes';
import { ToolbarItem } from './toolbar-item';

// ----------------------------------------------------------------------

export function ImageUploadBlock({ editor }) {
  const [url, setUrl] = useState('');
  const [tab, setTab] = useState(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setUrl('');
    setFile(null);
    setPreview('');
    setTab(0);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUploadImage = useCallback(async () => {
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    try {
      setUploading(true);

      // Upload to Supabase Storage
      const imageUrl = await uploadPostImage('editor', file);

      // Insert image into editor
      editor?.chain().focus().setImage({ src: imageUrl }).run();

      toast.success('Image uploaded successfully');
      handleClosePopover();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [file, editor]);

  const handleInsertUrl = useCallback(() => {
    if (!url) {
      toast.error('Please enter image URL');
      return;
    }

    editor?.chain().focus().setImage({ src: url }).run();
    handleClosePopover();
  }, [url, editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <ToolbarItem
        aria-label="Image"
        className={editorClasses.toolbar.image}
        onClick={handleOpenPopover}
        icon={
          <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
        }
      />
      <Popover
        id={anchorEl ? 'image-upload-popover' : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 400 } } }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
            <Tab label="Upload" />
            <Tab label="URL" />
          </Tabs>
        </Box>

        {/* Upload Tab */}
        {tab === 0 && (
          <Box sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Upload Image
            </Typography>

            {/* File Input */}
            <Box
              sx={{
                mb: 2,
                p: 3,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' },
              }}
              onClick={() => document.getElementById('editor-image-upload').click()}
            >
              <input
                id="editor-image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {preview ? (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'contain',
                      borderRadius: 1,
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview('');
                    }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <Iconify
                    icon="solar:cloud-upload-bold"
                    width={48}
                    sx={{ mb: 1, color: 'text.secondary' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Click to browse or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Max size: 5MB
                  </Typography>
                </>
              )}
            </Box>

            <Button
              fullWidth
              variant="contained"
              disabled={!file || uploading}
              onClick={handleUploadImage}
              startIcon={uploading && <CircularProgress size={20} />}
            >
              {uploading ? 'Uploading...' : 'Upload & Insert'}
            </Button>
          </Box>
        )}

        {/* URL Tab */}
        {tab === 1 && (
          <Box sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Image URL
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              sx={{ mb: 2 }}
            />

            <Button fullWidth variant="contained" disabled={!url} onClick={handleInsertUrl}>
              Insert Image
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
}
