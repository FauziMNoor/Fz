'use client';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function MenuItemTree({ items, onEdit, onDelete, onAddChild }) {
  // Build tree structure
  const buildTree = (items) => {
    const itemMap = {};
    const tree = [];

    items.forEach((item) => {
      itemMap[item.id] = { ...item, children: [] };
    });

    items.forEach((item) => {
      if (item.parent_id === null) {
        tree.push(itemMap[item.id]);
      } else if (itemMap[item.parent_id]) {
        itemMap[item.parent_id].children.push(itemMap[item.id]);
      }
    });

    return tree;
  };

  const tree = buildTree(items);

  return (
    <Box>
      {tree.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          level={0}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

function TreeNode({ item, level, onEdit, onDelete, onAddChild }) {
  const confirm = useBoolean();
  const popover = usePopover();

  const handleDelete = useCallback(() => {
    onDelete(item.id);
    confirm.onFalse();
  }, [onDelete, item.id, confirm]);

  const getTypeColor = (type) => {
    const colors = {
      category: 'primary',
      post: 'secondary',
      ebook: 'info',
      page: 'success',
      custom: 'warning',
      external: 'error',
    };
    return colors[type] || 'default';
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          mb: 1,
          ml: level * 4,
          bgcolor: 'background.neutral',
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Icon */}
        {item.icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              bgcolor: item.color || 'primary.lighter',
            }}
          >
            <Iconify icon={item.icon} width={24} />
          </Box>
        )}

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2">{item.title}</Typography>
            <Chip label={item.type} size="small" color={getTypeColor(item.type)} />
            {!item.is_active && <Label color="error">Inactive</Label>}
          </Box>
          {item.url && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {item.url}
            </Typography>
          )}
        </Box>

        {/* Order */}
        <Chip label={`Order: ${item.display_order}`} size="small" variant="outlined" />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => onAddChild(item)}>
            <Iconify icon="mingcute:add-line" />
          </IconButton>
          <IconButton
            size="small"
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Box>
      </Box>

      {/* Children */}
      {item.children && item.children.length > 0 && (
        <Box>
          {item.children.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </Box>
      )}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuItem
          onClick={() => {
            onEdit(item);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            onAddChild(item);
            popover.onClose();
          }}
        >
          <Iconify icon="mingcute:add-line" />
          Add Child
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Menu Item"
        content="Are you sure you want to delete this menu item? All child items will be deleted as well."
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
