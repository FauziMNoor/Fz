'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useParams, useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { getMenuById, deleteMenuItem, getAllMenuItems } from 'src/lib/supabase-client';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { MenuItemTree } from './menu-item-tree';
import { MenuItemDialog } from './menu-item-dialog';

// ----------------------------------------------------------------------

export function MenuItemListView() {
  const params = useParams();
  const router = useRouter();
  const dialog = useBoolean();

  const menuId = params.id;

  const [selectedItem, setSelectedItem] = useState(null);
  const [parentItem, setParentItem] = useState(null);

  // Fetch menu
  const { data: menu } = useSWR(menuId ? `menu-${menuId}` : null, () => getMenuById(menuId));

  // Fetch menu items
  const { data: items = [], mutate } = useSWR(menuId ? `menu-items-${menuId}` : null, () =>
    getAllMenuItems(menuId)
  );

  const handleEdit = useCallback(
    (item) => {
      setSelectedItem(item);
      setParentItem(null);
      dialog.onTrue();
    },
    [dialog]
  );

  const handleAddChild = useCallback(
    (parentItem) => {
      setSelectedItem(null);
      setParentItem(parentItem);
      dialog.onTrue();
    },
    [dialog]
  );

  const handleDelete = useCallback(
    async (itemId) => {
      try {
        await deleteMenuItem(itemId);
        toast.success('Menu item berhasil dihapus!');
        mutate();
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Gagal menghapus menu item');
      }
    },
    [mutate]
  );

  const handleCloseDialog = useCallback(() => {
    setSelectedItem(null);
    setParentItem(null);
    dialog.onFalse();
  }, [dialog]);

  const handleSaveSuccess = useCallback(() => {
    mutate();
    handleCloseDialog();
  }, [mutate, handleCloseDialog]);

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.menu.root);
  }, [router]);

  if (!menu) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton onClick={handleBack}>
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h4">Menu Items: {menu.name}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              setSelectedItem(null);
              setParentItem(null);
              dialog.onTrue();
            }}
          >
            Add Root Item
          </Button>
        </Box>
      </Box>

      <Card sx={{ p: 3 }}>
        {items.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Iconify icon="solar:menu-dots-bold" width={64} sx={{ mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No menu items yet
            </Typography>
            <Typography variant="body2">
              Click "Add Root Item" to create your first menu item
            </Typography>
          </Box>
        ) : (
          <MenuItemTree
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddChild={handleAddChild}
          />
        )}
      </Card>

      <MenuItemDialog
        open={dialog.value}
        onClose={handleCloseDialog}
        menuId={menuId}
        item={selectedItem}
        parentItem={parentItem}
        onSuccess={handleSaveSuccess}
      />
    </>
  );
}
