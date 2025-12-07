'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { useRouter } from 'src/routes/hooks';

import { supabase } from 'src/lib/supabase-client';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { EbookCategoryTableRow } from './ebook-category-table-row';
import { EbookCategoryDialog } from './ebook-category-dialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Category Name' },
  { id: 'slug', label: 'Slug' },
  { id: 'icon', label: 'Icon', width: 100 },
  { id: 'color', label: 'Color', width: 100 },
  { id: 'display_order', label: 'Order', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function EbookCategoryListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'display_order' });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const confirm = useConfirmDialog();

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ebook_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenDialog = (category = null) => {
    setCurrentCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentCategory(null);
    setOpenDialog(false);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (currentCategory) {
        // Update
        const { error } = await supabase
          .from('ebook_categories')
          .update(categoryData)
          .eq('id', currentCategory.id);

        if (error) throw error;
        toast.success('Category updated successfully!');
      } else {
        // Create
        const { error } = await supabase.from('ebook_categories').insert([categoryData]);

        if (error) throw error;
        toast.success('Category created successfully!');
      }

      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = useCallback(
    async (id) => {
      try {
        // Check if category is used by any e-books
        const { count } = await supabase
          .from('ebooks')
          .select('*', { count: 'exact', head: true })
          .eq('category', categories.find((c) => c.id === id)?.slug);

        if (count > 0) {
          toast.error(`Cannot delete category. ${count} e-book(s) are using this category.`);
          return;
        }

        const { error } = await supabase.from('ebook_categories').delete().eq('id', id);

        if (error) throw error;

        toast.success('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    },
    [categories, fetchCategories]
  );

  const notFound = !loading && !categories.length;

  return (
    <>
      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Box flexGrow={1}>
            <Box sx={{ typography: 'h4' }}>E-Book Categories</Box>
            <Box sx={{ typography: 'body2', color: 'text.secondary', mt: 0.5 }}>
              Manage e-book categories
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenDialog()}
          >
            New Category
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={categories.length}
                  numSelected={0}
                  onSort={table.onSort}
                />

                <TableBody>
                  {categories
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <EbookCategoryTableRow
                        key={row.id}
                        row={row}
                        onEditRow={() => handleOpenDialog(row)}
                        onDeleteRow={() => {
                          confirm.onTrue();
                          confirm.setData(row.id);
                        }}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, categories.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={categories.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <EbookCategoryDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveCategory}
        currentCategory={currentCategory}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Category"
        content="Are you sure you want to delete this category? This action cannot be undone."
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteCategory(confirm.data);
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
