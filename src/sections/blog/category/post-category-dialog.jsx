'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const CategorySchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  slug: zod.string().min(1, { message: 'Slug is required!' }),
  description: zod.string().optional(),
  icon: zod.string().optional(),
  color: zod.string().optional(),
  display_order: zod.number().min(0),
});

// ----------------------------------------------------------------------

const ICON_OPTIONS = [
  { value: 'solar:graduation-bold-duotone', label: 'Graduation (Pendidikan)' },
  { value: 'solar:lightbulb-bold-duotone', label: 'Lightbulb (Agile)' },
  { value: 'solar:crown-bold-duotone', label: 'Crown (Kepemimpinan)' },
  { value: 'solar:mosque-bold-duotone', label: 'Mosque (Pesantren)' },
  { value: 'solar:laptop-bold-duotone', label: 'Laptop (Teknologi)' },
  { value: 'solar:star-bold-duotone', label: 'Star (Pengembangan Diri)' },
  { value: 'solar:heart-bold-duotone', label: 'Heart' },
  { value: 'solar:book-bold-duotone', label: 'Book' },
  { value: 'solar:document-text-bold-duotone', label: 'Document' },
  { value: 'solar:pen-bold-duotone', label: 'Pen' },
];

const COLOR_OPTIONS = [
  { value: '#6950E8', label: 'Purple' },
  { value: '#00A76F', label: 'Green' },
  { value: '#00B8D9', label: 'Cyan' },
  { value: '#FFAB00', label: 'Orange' },
  { value: '#8E33FF', label: 'Violet' },
  { value: '#22C55E', label: 'Light Green' },
  { value: '#FF5630', label: 'Red' },
  { value: '#0EA5E9', label: 'Blue' },
];

// ----------------------------------------------------------------------

export function PostCategoryDialog({ open, onClose, onSave, currentCategory }) {
  const defaultValues = useMemo(
    () => ({
      name: currentCategory?.name || '',
      slug: currentCategory?.slug || '',
      description: currentCategory?.description || '',
      icon: currentCategory?.icon || 'solar:document-text-bold-duotone',
      color: currentCategory?.color || '#6950E8',
      display_order: currentCategory?.display_order ?? 0,
    }),
    [currentCategory]
  );

  const methods = useForm({
    resolver: zodResolver(CategorySchema),
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

  useEffect(() => {
    if (currentCategory) {
      reset(defaultValues);
    }
  }, [currentCategory, defaultValues, reset]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!currentCategory && values.name) {
      const slug = values.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
      setValue('slug', slug);
    }
  }, [values.name, currentCategory, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await onSave(data);
      reset();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{currentCategory ? 'Edit Category' : 'New Category'}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Field.Text name="name" label="Category Name" required />

            <Field.Text
              name="slug"
              label="Slug"
              required
              helperText="URL-friendly identifier (auto-generated from name)"
            />

            <Field.Text
              name="description"
              label="Description"
              multiline
              rows={2}
              placeholder="Short description about this category..."
            />

            <Field.Select name="icon" label="Icon">
              {ICON_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="color" label="Color">
              {COLOR_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        backgroundColor: option.value,
                        border: '1px solid #ddd',
                      }}
                    />
                    <span>{option.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text
              name="display_order"
              label="Display Order"
              type="number"
              helperText="Lower numbers appear first"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton variant="outlined" onClick={handleClose}>
            Cancel
          </LoadingButton>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentCategory ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
