'use client';

import { useCallback } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function MenuTableRow({ row, onEdit, onDelete, onManageItems }) {
  const confirm = useBoolean();
  const popover = usePopover();

  const handleDelete = useCallback(() => {
    onDelete();
    confirm.onFalse();
  }, [onDelete, confirm]);

  const getLocationLabel = (location) => {
    const labels = {
      header: 'Header',
      footer: 'Footer',
      sidebar: 'Sidebar',
    };
    return labels[location] || location;
  };

  const getLocationColor = (location) => {
    const colors = {
      header: 'primary',
      footer: 'secondary',
      sidebar: 'info',
    };
    return colors[location] || 'default';
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Box>
            <Box sx={{ fontWeight: 600, mb: 0.5 }}>{row.name}</Box>
            <Box sx={{ typography: 'caption', color: 'text.secondary' }}>{row.slug}</Box>
          </Box>
        </TableCell>

        <TableCell>
          <Chip
            label={getLocationLabel(row.location)}
            color={getLocationColor(row.location)}
            size="small"
          />
        </TableCell>

        <TableCell align="center">
          <Button
            size="small"
            variant="outlined"
            onClick={onManageItems}
            startIcon={<Iconify icon="solar:list-bold" />}
          >
            Manage Items
          </Button>
        </TableCell>

        <TableCell align="center">
          <Label color={row.is_active ? 'success' : 'error'}>
            {row.is_active ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuItem
          onClick={() => {
            onManageItems();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:list-bold" />
          Manage Items
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEdit();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
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
        title="Delete Menu"
        content="Are you sure you want to delete this menu? All menu items will be deleted as well."
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
