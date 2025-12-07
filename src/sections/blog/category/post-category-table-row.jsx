import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { usePopover } from 'minimal-shared/hooks';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function PostCategoryTableRow({ row, onEditRow, onDeleteRow }) {
  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        {/* Name */}
        <TableCell>
          <Typography variant="subtitle2">{row.name}</Typography>
          {row.description && (
            <Typography variant="caption" color="text.secondary">
              {row.description}
            </Typography>
          )}
        </TableCell>

        {/* Slug */}
        <TableCell>
          <Chip label={row.slug} size="small" variant="soft" />
        </TableCell>

        {/* Icon */}
        <TableCell>
          {row.icon && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon={row.icon} width={24} />
              <Typography variant="caption" color="text.secondary">
                {row.icon}
              </Typography>
            </Box>
          )}
        </TableCell>

        {/* Color */}
        <TableCell>
          {row.color && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  bgcolor: row.color,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {row.color}
              </Typography>
            </Box>
          )}
        </TableCell>

        {/* Display Order */}
        <TableCell>
          <Typography variant="body2">{row.display_order}</Typography>
        </TableCell>

        {/* Actions */}
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
        <MenuList>
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDeleteRow();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
