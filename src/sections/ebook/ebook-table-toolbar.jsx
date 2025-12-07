import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function EbookTableToolbar({ filters, onResetPage, onFilters, canReset, onResetFilters }) {
  const handleFilterSearch = useCallback(
    (event) => {
      onResetPage();
      onFilters('search', event.target.value);
    },
    [onFilters, onResetPage]
  );

  const handleFilterStatus = useCallback(
    (event) => {
      onResetPage();
      onFilters('status', event.target.value);
    },
    [onFilters, onResetPage]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="ebook-filter-status-select-label">Status</InputLabel>

        <Select
          value={filters.status}
          onChange={handleFilterStatus}
          input={<OutlinedInput label="Status" />}
          MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.search}
          onChange={handleFilterSearch}
          placeholder="Search e-book or author..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {canReset && (
          <IconButton onClick={onResetFilters}>
            <Iconify icon="solar:restart-bold" />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}
