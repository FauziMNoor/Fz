'use client';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { createMenu, updateMenu } from 'src/lib/supabase-client';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const MenuSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  slug: zod.string().min(1, 'Slug is required'),
  location: zod.string().min(1, 'Location is required'),
  description: zod.string().optional(),
  is_active: zod.boolean(),
});

// ----------------------------------------------------------------------

export function MenuDialog({ open, onClose, menu, onSuccess }) {
  const isEdit = !!menu;

  const defaultValues = useMemo(
    () => ({
      name: menu?.name || '',
      slug: menu?.slug || '',
      location: menu?.location || 'header',
      description: menu?.description || '',
      is_active: menu?.is_active ?? true,
    }),
    [menu]
  );

  const methods = useForm({
    resolver: zodResolver(MenuSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEdit) {
        await updateMenu(menu.id, data);
        toast.success('Menu berhasil diupdate!');
      } else {
        await createMenu(data);
        toast.success('Menu berhasil dibuat!');
      }
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error(isEdit ? 'Gagal update menu' : 'Gagal membuat menu');
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Menu' : 'Create New Menu'}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Field.Text name="name" label="Menu Name" required />

            <Field.Text
              name="slug"
              label="Slug"
              required
              helperText="URL-friendly identifier (e.g., main-nav)"
            />

            <Field.Select name="location" label="Location" required>
              <MenuItem value="header">Header</MenuItem>
              <MenuItem value="footer">Footer</MenuItem>
              <MenuItem value="sidebar">Sidebar</MenuItem>
            </Field.Select>

            <Field.Text name="description" label="Description" multiline rows={3} />

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
