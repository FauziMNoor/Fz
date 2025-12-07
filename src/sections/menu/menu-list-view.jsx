'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'minimal-shared/hooks';

import { paths } from 'src/routes/paths';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { MenuTableRow } from './menu-table-row';
import { MenuDialog } from './menu-dialog';
import { getMenus, deleteMenu } from 'src/lib/supabase-client';
import useSWR from 'swr';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Menu Name' },
  { id: 'location', label: 'Location' },
  { id: 'items', label: 'Items', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

export function MenuListView() {
  const router = useRouter();
  const table = useTable();
  const dialog = useBoolean();

  const [selectedMenu, setSelectedMenu] = useState(null);

  // Fetch menus
  const { data: menus = [], error, mutate } = useSWR('menus', getMenus);

  const notFound = !menus.length && !error;

  const handleEdit = useCallback(
    (menu) => {
      setSelectedMenu(menu);
      dialog.onTrue();
    },
    [dialog]
  );

  const handleDelete = useCallback(
    async (menuId) => {
      try {
        await deleteMenu(menuId);
        toast.success('Menu berhasil dihapus!');
        mutate();
      } catch (error) {
        console.error('Error deleting menu:', error);
        toast.error('Gagal menghapus menu');
      }
    },
    [mutate]
  );

  const handleManageItems = useCallback(
    (menuId) => {
      router.push(paths.dashboard.menu.items(menuId));
    },
    [router]
  );

  const handleCloseDialog = useCallback(() => {
    setSelectedMenu(null);
    dialog.onFalse();
  }, [dialog]);

  const handleSaveSuccess = useCallback(() => {
    mutate();
    handleCloseDialog();
  }, [mutate, handleCloseDialog]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h4">Menu Management</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={dialog.onTrue}
        >
          New Menu
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headCells={TABLE_HEAD}
              rowCount={menus.length}
              onSort={table.onSort}
            />

            <TableBody>
              {menus
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((menu) => (
                  <MenuTableRow
                    key={menu.id}
                    row={menu}
                    onEdit={() => handleEdit(menu)}
                    onDelete={() => handleDelete(menu.id)}
                    onManageItems={() => handleManageItems(menu.id)}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 76}
                emptyRows={emptyRows(table.page, table.rowsPerPage, menus.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={menus.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <MenuDialog
        open={dialog.value}
        onClose={handleCloseDialog}
        menu={selectedMenu}
        onSuccess={handleSaveSuccess}
      />
    </>
  );
}
