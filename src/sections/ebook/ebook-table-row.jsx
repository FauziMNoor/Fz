import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { usePopover } from 'minimal-shared/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function EbookTableRow({ row, selected, onEditRow, onViewRow, onSelectRow, onDeleteRow }) {
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* E-Book Info */}
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar variant="rounded" src={row.cover_image_url} sx={{ width: 48, height: 64 }} />

            <Stack>
              <Typography variant="subtitle2" noWrap sx={{ maxWidth: 300 }}>
                {row.title}
              </Typography>

              <Stack direction="row" spacing={0.5} alignItems="center">
                {row.is_own_work && (
                  <Iconify icon="solar:pen-bold" width={14} color="primary.main" />
                )}
                {row.is_featured && (
                  <Iconify icon="solar:star-bold" width={14} color="warning.main" />
                )}
                <Typography variant="caption" color="text.secondary">
                  {row.file_format} • {row.file_size}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </TableCell>

        {/* Author */}
        <TableCell>
          <Typography variant="body2">{row.author_name}</Typography>
        </TableCell>

        {/* Category */}
        <TableCell>
          {row.category ? (
            <Label variant="soft" color="info">
              {row.category.replace(/-/g, ' ')}
            </Label>
          ) : (
            '-'
          )}
        </TableCell>

        {/* Status */}
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'published' && 'success') ||
              (row.status === 'draft' && 'warning') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        {/* Downloads */}
        <TableCell align="center">
          <Typography variant="body2">{fShortenNumber(row.download_count || 0)}</Typography>
        </TableCell>

        {/* Views */}
        <TableCell align="center">
          <Typography variant="body2">{fShortenNumber(row.view_count || 0)}</Typography>
        </TableCell>

        {/* Created Date */}
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {fDate(row.created_at)}
          </Typography>
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
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

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
