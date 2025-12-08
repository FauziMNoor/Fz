'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import {
  createEbook,
  updateEbook,
  uploadEbookCover,
  getEbookCategories,
} from 'src/lib/supabase-client';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const EbookSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().optional(),
  google_drive_url: zod.string().url({ message: 'Must be a valid URL!' }),
  file_size: zod.string().optional(),
  file_format: zod.string().min(1, { message: 'File format is required!' }),
  author_name: zod.string().min(1, { message: 'Author name is required!' }),
  is_own_work: zod.boolean(),
  category: zod.string().optional(),
  tags: zod.array(zod.string()).optional(),
  is_featured: zod.boolean(),
  status: zod.enum(['published', 'draft', 'archived']),
  display_order: zod.number().optional(),
});

// ----------------------------------------------------------------------

export function EbookNewEditForm({ currentEbook }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(currentEbook?.cover_image_url || null);
  const [tagInput, setTagInput] = useState('');

  const defaultValues = useMemo(
    () => ({
      title: currentEbook?.title || '',
      description: currentEbook?.description || '',
      google_drive_url: currentEbook?.google_drive_url || '',
      file_size: currentEbook?.file_size || '',
      file_format: currentEbook?.file_format || 'PDF',
      author_name: currentEbook?.author_name || 'Fauzi M. Noor',
      is_own_work: currentEbook?.is_own_work ?? true,
      category: currentEbook?.category || '',
      tags: currentEbook?.tags || [],
      is_featured: currentEbook?.is_featured ?? false,
      status: currentEbook?.status || 'draft',
      display_order: currentEbook?.display_order || 0,
    }),
    [currentEbook]
  );

  const methods = useForm({
    resolver: zodResolver(EbookSchema),
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

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getEbookCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentEbook) {
      reset(defaultValues);
      setCoverPreview(currentEbook.cover_image_url);
    }
  }, [currentEbook, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let coverUrl = coverPreview;

      // Upload cover image if new file selected
      if (coverFile) {
        const tempId = currentEbook?.id || `temp_${Date.now()}`;
        coverUrl = await uploadEbookCover(tempId, coverFile);
      }

      const ebookData = {
        ...data,
        cover_image_url: coverUrl,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
      };

      if (currentEbook) {
        await updateEbook(currentEbook.id, ebookData);
        toast.success('E-book updated successfully!');
      } else {
        await createEbook(ebookData);
        toast.success('E-book created successfully!');
      }

      router.push(paths.dashboard.ebook.root);
    } catch (error) {
      console.error('Error saving e-book:', error);
      toast.error(error.message || 'Failed to save e-book');
    }
  });

  const handleDropCover = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      toast.success('Cover image selected successfully!');
    }
  }, []);

  const handleRemoveCover = useCallback(() => {
    setCoverFile(null);
    setCoverPreview(null);
    toast.info('Cover image removed');
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !values.tags.includes(tagInput.trim())) {
      setValue('tags', [...values.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setValue(
      'tags',
      values.tags.filter((tag) => tag !== tagToDelete)
    );
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {/* Basic Information */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Informasi Dasar
          </Typography>

          <Stack spacing={3}>
            <Field.Text name="title" label="Judul E-Book" required />

            <Field.Text
              name="description"
              label="Deskripsi"
              multiline
              rows={4}
              placeholder="Deskripsi singkat tentang e-book ini..."
            />

            <Field.Text name="author_name" label="Nama Penulis" required />

            <FormControlLabel
              control={
                <Switch
                  checked={values.is_own_work}
                  onChange={(e) => setValue('is_own_work', e.target.checked)}
                />
              }
              label="Karya Sendiri (Fauzi M. Noor)"
            />
          </Stack>
        </Card>

        {/* Cover Image */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Cover E-Book
          </Typography>

          <Upload
            value={coverPreview}
            onDrop={handleDropCover}
            onDelete={handleRemoveCover}
            accept={{ 'image/*': [] }}
            helperText="Recommended: 600x800px (ratio 3:4)"
          />
        </Card>

        {/* File Information */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Informasi File
          </Typography>

          <Stack spacing={3}>
            <Field.Text
              name="google_drive_url"
              label="Google Drive URL"
              required
              placeholder="https://drive.google.com/file/d/xxxxx/view"
              helperText="Link Google Drive untuk download e-book"
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Select name="file_format" label="Format File" required>
                <MenuItem value="PDF">PDF</MenuItem>
                <MenuItem value="EPUB">EPUB</MenuItem>
                <MenuItem value="MOBI">MOBI</MenuItem>
                <MenuItem value="DOCX">DOCX</MenuItem>
              </Field.Select>

              <Field.Text
                name="file_size"
                label="Ukuran File"
                placeholder="2.5 MB"
                helperText="Contoh: 2.5 MB, 1.8 MB"
              />
            </Stack>
          </Stack>
        </Card>

        {/* Categorization */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Kategori & Tags
          </Typography>

          <Stack spacing={3}>
            <Field.Select name="category" label="Kategori">
              <MenuItem value="">Pilih Kategori</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </MenuItem>
              ))}
            </Field.Select>

            {/* Tags */}
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Tambah tag..."
                />
                <LoadingButton variant="outlined" onClick={handleAddTag}>
                  Add
                </LoadingButton>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {values.tags.map((tag) => (
                  <Chip key={tag} label={tag} onDelete={() => handleDeleteTag(tag)} />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Card>

        {/* Settings */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Pengaturan
          </Typography>

          <Stack spacing={3}>
            <Field.Select name="status" label="Status" required>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Field.Select>

            <FormControlLabel
              control={
                <Switch
                  checked={values.is_featured}
                  onChange={(e) => setValue('is_featured', e.target.checked)}
                />
              }
              label="Featured E-Book"
            />

            <Field.Text
              name="display_order"
              label="Display Order"
              type="number"
              helperText="Urutan tampilan (0 = paling atas)"
            />
          </Stack>
        </Card>

        <Divider />

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <LoadingButton
            type="button"
            variant="outlined"
            onClick={() => router.push(paths.dashboard.ebook.root)}
          >
            Cancel
          </LoadingButton>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentEbook ? 'Update E-Book' : 'Create E-Book'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
