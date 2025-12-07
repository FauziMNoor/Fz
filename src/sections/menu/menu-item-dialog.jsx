'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { createMenuItem, updateMenuItem } from 'src/lib/supabase-client';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const MenuItemSchema = zod.object({
  title: zod.string().min(1, 'Title is required'),
  type: zod.string().min(1, 'Type is required'),
  reference_type: zod.string().optional(),
  url: zod.string().optional(),
  icon: zod.string().optional(),
  color: zod.string().optional(),
  description: zod.string().optional(),
  target: zod.string(),
  display_order: zod.number().min(0),
  is_active: zod.boolean(),
});

// ----------------------------------------------------------------------

const MENU_TYPES = [
  { value: 'category', label: 'Category' },
  { value: 'post', label: 'Post' },
  { value: 'ebook', label: 'E-Book' },
  { value: 'page', label: 'Page' },
  { value: 'custom', label: 'Custom Link' },
  { value: 'external', label: 'External Link' },
];

const REFERENCE_TYPES = [
  { value: 'post_category', label: 'Post Category' },
  { value: 'ebook_category', label: 'E-Book Category' },
];

const ICON_OPTIONS = [
  'solar:home-angle-bold-duotone',
  'solar:document-text-bold-duotone',
  'solar:book-bold-duotone',
  'solar:user-bold-duotone',
  'solar:folder-bold-duotone',
  'solar:tag-bold-duotone',
  'solar:star-bold-duotone',
  'solar:heart-bold-duotone',
  'solar:settings-bold-duotone',
  'solar:info-circle-bold-duotone',
];

const COLOR_OPTIONS = [
  { value: 'primary.main', label: 'Primary' },
  { value: 'secondary.main', label: 'Secondary' },
  { value: 'info.main', label: 'Info' },
  { value: 'success.main', label: 'Success' },
  { value: 'warning.main', label: 'Warning' },
  { value: 'error.main', label: 'Error' },
];

// ----------------------------------------------------------------------

export function MenuItemDialog({ open, onClose, menuId, item, parentItem, onSuccess }) {
  const isEdit = !!item;

  const defaultValues = useMemo(
    () => ({
      title: item?.title || '',
      type: item?.type || 'page',
      reference_type: item?.reference_type || '',
      url: item?.url || '',
      icon: item?.icon || '',
      color: item?.color || '',
      description: item?.description || '',
      target: item?.target || '_self',
      display_order: item?.display_order || 0,
      is_active: item?.is_active ?? true,
    }),
    [item]
  );

  const methods = useForm({
    resolver: zodResolver(MenuItemSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const selectedType = watch('type');

  useEffect(() => {
    reset(defaultValues);
  }, [item, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        menu_id: menuId,
        parent_id: parentItem?.id || item?.parent_id || null,
      };

      if (isEdit) {
        await updateMenuItem(item.id, payload);
        toast.success('Menu item berhasil diupdate!');
      } else {
        await createMenuItem(payload);
        toast.success('Menu item berhasil dibuat!');
      }
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(isEdit ? 'Gagal update menu item' : 'Gagal membuat menu item');
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const showReferenceType = selectedType === 'category';
  const showUrl = ['page', 'custom', 'external'].includes(selectedType);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit
          ? 'Edit Menu Item'
          : parentItem
            ? `Add Child to "${parentItem.title}"`
            : 'Add Root Menu Item'}
      </DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {parentItem && (
              <Alert severity="info">
                This item will be added as a child of &ldquo;{parentItem.title}&rdquo;
              </Alert>
            )}

            <Field.Text name="title" label="Title" required />

            <Field.Select name="type" label="Type" required>
              {MENU_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            {showReferenceType && (
              <Field.Select name="reference_type" label="Reference Type">
                <MenuItem value="">None</MenuItem>
                {REFERENCE_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            )}

            {showUrl && (
              <Field.Text
                name="url"
                label="URL"
                placeholder="/page-url or https://external.com"
                helperText="Enter relative path (e.g., /post) or full URL"
              />
            )}

            <Field.Select name="icon" label="Icon">
              <MenuItem value="">None</MenuItem>
              {ICON_OPTIONS.map((icon) => (
                <MenuItem key={icon} value={icon}>
                  {icon}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="color" label="Color">
              <MenuItem value="">Default</MenuItem>
              {COLOR_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="description" label="Description" multiline rows={2} />

            <Field.Select name="target" label="Target">
              <MenuItem value="_self">Same Window</MenuItem>
              <MenuItem value="_blank">New Window</MenuItem>
            </Field.Select>

            <Field.Text
              name="display_order"
              label="Display Order"
              type="number"
              helperText="Lower numbers appear first"
            />

            <Field.Switch name="is_active" label="Active" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
