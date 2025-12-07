'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import {
  createPortfolio,
  updatePortfolio,
  uploadPortfolioCoverImage,
} from 'src/lib/supabase-client';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const PortfolioSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().optional(),
  category: zod.enum(['project', 'presentation', 'achievement', 'publication']),
  cover_image: zod.string().optional(),
  link_url: zod.string().url().optional().or(zod.literal('')),
  tags: zod.array(zod.string()).optional(),
  featured: zod.boolean(),
  is_published: zod.boolean(),
  display_order: zod.number().int().min(0).optional(),
});

// ----------------------------------------------------------------------

export function PortfolioNewEditForm({ currentPortfolio }) {
  const router = useRouter();
  const { user } = useAuthContext();

  const [tagInput, setTagInput] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const defaultValues = useMemo(
    () => ({
      title: currentPortfolio?.title || '',
      description: currentPortfolio?.description || '',
      category: currentPortfolio?.category || 'project',
      cover_image: currentPortfolio?.cover_image || '',
      link_url: currentPortfolio?.link_url || '',
      tags: currentPortfolio?.tags || [],
      featured: currentPortfolio?.featured || false,
      is_published: currentPortfolio?.is_published ?? true,
      display_order: currentPortfolio?.display_order || 0,
    }),
    [currentPortfolio]
  );

  const methods = useForm({
    resolver: zodResolver(PortfolioSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      let coverImageUrl = data.cover_image;

      // Upload cover image if file is selected
      if (coverImageFile) {
        const tempId = currentPortfolio?.id || `temp_${Date.now()}`;
        coverImageUrl = await uploadPortfolioCoverImage(user?.id, tempId, coverImageFile);
      }

      const portfolioData = {
        ...data,
        cover_image: coverImageUrl,
      };

      if (currentPortfolio) {
        // Update existing portfolio
        await updatePortfolio(currentPortfolio.id, portfolioData);
        toast.success('Portfolio updated successfully!');
      } else {
        // Create new portfolio
        await createPortfolio(user?.id, portfolioData);
        toast.success('Portfolio created successfully!');
      }

      reset();
      router.push(paths.dashboard.portfolio.root);
    } catch (error) {
      toast.error(error.message || 'Failed to save portfolio');
    }
  });

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !values.tags.includes(tagInput.trim())) {
      setValue('tags', [...values.tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, values.tags, setValue]);

  const handleDeleteTag = useCallback(
    (tagToDelete) => {
      setValue(
        'tags',
        values.tags.filter((tag) => tag !== tagToDelete)
      );
    },
    [values.tags, setValue]
  );

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  const handleDropCoverImage = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setCoverImageFile(file);
        const preview = URL.createObjectURL(file);
        setCoverImagePreview(preview);
        setValue('cover_image', preview); // Set preview in form
      }
    },
    [setValue]
  );

  const handleRemoveCoverImage = useCallback(() => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setValue('cover_image', '');
  }, [setValue]);

  const categoryOptions = [
    { value: 'project', label: 'Project', icon: '💻' },
    { value: 'presentation', label: 'Presentation', icon: '📊' },
    { value: 'achievement', label: 'Achievement', icon: '🏆' },
    { value: 'publication', label: 'Publication', icon: '📄' },
  ];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {/* Main Content */}
        <Card>
          <CardHeader title="Portfolio Details" subheader="Fill in the information below" />

          <Divider />

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* Title */}
            <Field.Text name="title" label="Title" required />

            {/* Description */}
            <Field.Text
              name="description"
              label="Description"
              multiline
              rows={4}
              placeholder="Describe your portfolio item..."
            />

            {/* Category */}
            <Field.Select name="category" label="Category" required>
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </Box>
                </MenuItem>
              ))}
            </Field.Select>

            {/* Cover Image Upload */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Cover Image
              </Typography>
              <Upload
                value={coverImagePreview || values.cover_image}
                onDrop={handleDropCoverImage}
                onDelete={handleRemoveCoverImage}
                accept={{ 'image/*': [] }}
                maxSize={5242880}
                helperText="Drop image here or click to browse (Max 5MB)"
              />
            </Box>

            {/* External Link */}
            <Field.Text
              name="link_url"
              label="External Link (Optional)"
              placeholder="https://example.com"
              helperText="Link to project, presentation, or publication"
            />

            {/* Tags */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <TextField
                fullWidth
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type and press Enter to add tags"
                helperText="Press Enter to add a tag"
                InputProps={{
                  endAdornment: tagInput && (
                    <InputAdornment position="end">
                      <LoadingButton size="small" onClick={handleAddTag}>
                        Add
                      </LoadingButton>
                    </InputAdornment>
                  ),
                }}
              />
              {values.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {values.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Stack>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader title="Settings" subheader="Configure display options" />

          <Divider />

          <Stack spacing={2} sx={{ p: 3 }}>
            {/* Featured */}
            <FormControlLabel
              control={
                <Switch
                  checked={values.featured}
                  onChange={(e) => setValue('featured', e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2">Featured</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Show this portfolio in the featured section
                  </Typography>
                </Box>
              }
              labelPlacement="start"
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {/* Published */}
            <FormControlLabel
              control={
                <Switch
                  checked={values.is_published}
                  onChange={(e) => setValue('is_published', e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2">Published</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Make this portfolio visible to public
                  </Typography>
                </Box>
              }
              labelPlacement="start"
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {/* Display Order */}
            <Field.Text
              name="display_order"
              label="Display Order"
              type="number"
              helperText="Lower numbers appear first (0 = highest priority)"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Stack>
        </Card>

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <LoadingButton
            type="button"
            variant="outlined"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </LoadingButton>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentPortfolio ? 'Update Portfolio' : 'Create Portfolio'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
