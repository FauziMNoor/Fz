'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { getAllEbooks, deleteEbook } from 'src/lib/supabase-client';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { EbookTableRow } from '../ebook-table-row';
import { EbookTableToolbar } from '../ebook-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'E-Book' },
  { id: 'author_name', label: 'Author' },
  { id: 'category', label: 'Category' },
  { id: 'status', label: 'Status' },
  { id: 'download_count', label: 'Downloads', align: 'center' },
  { id: 'view_count', label: 'Views', align: 'center' },
  { id: 'created_at', label: 'Created', width: 140 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function EbookListDashboardView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'created_at', defaultOrder: 'desc' });

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', search: '' });

  const confirm = useConfirmDialog();

  // Fetch e-books
  const fetchEbooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllEbooks();
      setEbooks(data);
      setTableData(data);
    } catch (error) {
      console.error('Error fetching e-books:', error);
      toast.error('Failed to fetch e-books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEbooks();
  }, [fetchEbooks]);

  // Apply filters
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = filters.status !== 'all' || filters.search !== '';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({ ...prevState, [name]: value }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({ status: 'all', search: '' });
  }, []);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteEbook(id);
        toast.success('E-book deleted successfully!');

        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch (error) {
        console.error('Error deleting e-book:', error);
        toast.error('Failed to delete e-book');
      }
    },
    [dataInPage.length, table, tableData]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.ebook.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (slug) => {
      router.push(paths.ebook.details(slug));
    },
    [router]
  );

  return (
    <>
      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Box flexGrow={1}>
            <Box sx={{ typography: 'h4' }}>E-Books</Box>
            <Box sx={{ typography: 'body2', color: 'text.secondary', mt: 0.5 }}>
              Manage your e-book collection
            </Box>
          </Box>

          <Button
            component={RouterLink}
            href={paths.dashboard.ebook.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New E-Book
          </Button>
        </Box>

        <Card>
          <EbookTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <EbookTableRow
                        key={row.id}
                        row={row}
                        onEditRow={() => handleEditRow(row.id)}
                        onViewRow={() => handleViewRow(row.slug)}
                        onDeleteRow={() => {
                          confirm.onTrue();
                          confirm.setData(row.id);
                        }}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete E-Book"
        content="Are you sure you want to delete this e-book?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(confirm.data);
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { status, search } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (search) {
    inputData = inputData.filter(
      (ebook) =>
        ebook.title.toLowerCase().includes(search.toLowerCase()) ||
        ebook.author_name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((ebook) => ebook.status === status);
  }

  return inputData;
}

// ----------------------------------------------------------------------

function useConfirmDialog() {
  const [value, setValue] = useState(false);
  const [data, setData] = useState(null);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
    setData(null);
  }, []);

  return {
    value,
    data,
    onTrue,
    onFalse,
    setData,
  };
}
