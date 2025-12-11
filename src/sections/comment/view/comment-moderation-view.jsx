'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import {
  approveComment,
  rejectComment,
  deletePostComment,
  getAllCommentsForModeration,
} from 'src/lib/supabase-client';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
];

const TABLE_HEAD = [
  { id: 'user', label: 'Pengguna' },
  { id: 'message', label: 'Komentar' },
  { id: 'post', label: 'Post' },
  { id: 'status', label: 'Status' },
  { id: 'date', label: 'Tanggal' },
  { id: 'actions', label: 'Aksi', align: 'center' },
];

// ----------------------------------------------------------------------

export function CommentModerationView() {
  const table = useTable();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const status = filterStatus === 'all' ? null : filterStatus;
      const data = await getAllCommentsForModeration(status);
      setComments(data || []);
    } catch (error) {
      toast.error('Gagal memuat komentar');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleApprove = useCallback(
    async (commentId) => {
      try {
        await approveComment(commentId);
        toast.success('Komentar disetujui!');
        fetchComments();
      } catch (error) {
        toast.error('Gagal menyetujui komentar');
      }
    },
    [fetchComments]
  );

  const handleReject = useCallback(
    async (commentId) => {
      try {
        await rejectComment(commentId);
        toast.success('Komentar ditolak!');
        fetchComments();
      } catch (error) {
        toast.error('Gagal menolak komentar');
      }
    },
    [fetchComments]
  );

  const handleDelete = useCallback(
    async (commentId) => {
      if (!window.confirm('Yakin ingin menghapus komentar ini?')) {
        return;
      }

      try {
        await deletePostComment(commentId);
        toast.success('Komentar dihapus!');
        fetchComments();
      } catch (error) {
        toast.error('Gagal menghapus komentar');
      }
    },
    [fetchComments]
  );

  const dataFiltered = comments;

  const notFound = !dataFiltered.length;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Moderasi Komentar"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Moderasi Komentar' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filterStatus}
          onChange={(e, newValue) => setFilterStatus(newValue)}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.divider}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filterStatus) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === 'pending' && 'warning') ||
                    (tab.value === 'approved' && 'success') ||
                    (tab.value === 'rejected' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all'
                    ? comments.length
                    : comments.filter((c) => c.status === tab.value).length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
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
                    <CommentTableRow
                      key={row.id}
                      row={row}
                      onApprove={() => handleApprove(row.id)}
                      onReject={() => handleReject(row.id)}
                      onDelete={() => handleDelete(row.id)}
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
  );
}

// ----------------------------------------------------------------------

function CommentTableRow({ row, onApprove, onReject, onDelete }) {
  const {
    user_name,
    user_avatar,
    message,
    post_title,
    post_slug,
    status,
    created_at,
    guest_email,
  } = row;

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={user_name} src={user_avatar} sx={{ mr: 2 }}>
          {user_name?.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Box sx={{ typography: 'body2', fontWeight: 'medium' }}>{user_name}</Box>
          {guest_email && (
            <Box sx={{ typography: 'caption', color: 'text.secondary' }}>{guest_email}</Box>
          )}
        </Box>
      </TableCell>

      <TableCell sx={{ maxWidth: 300 }}>
        <Box
          sx={{
            typography: 'body2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            whiteSpace: 'pre-wrap',
          }}
        >
          {message}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2', maxWidth: 200 }}>{post_title}</Box>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'approved' && 'success') || (status === 'rejected' && 'error') || 'warning'
          }
        >
          {status === 'pending' && 'Menunggu'}
          {status === 'approved' && 'Disetujui'}
          {status === 'rejected' && 'Ditolak'}
        </Label>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'caption', color: 'text.secondary' }}>{fDate(created_at)}</Box>
      </TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
          {status === 'pending' && (
            <>
              <Tooltip title="Setujui">
                <IconButton size="small" color="success" onClick={onApprove}>
                  <Iconify icon="solar:check-circle-bold" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Tolak">
                <IconButton size="small" color="error" onClick={onReject}>
                  <Iconify icon="solar:close-circle-bold" />
                </IconButton>
              </Tooltip>
            </>
          )}

          {status === 'approved' && (
            <Tooltip title="Tolak">
              <IconButton size="small" color="warning" onClick={onReject}>
                <Iconify icon="solar:close-circle-bold" />
              </IconButton>
            </Tooltip>
          )}

          {status === 'rejected' && (
            <Tooltip title="Setujui">
              <IconButton size="small" color="success" onClick={onApprove}>
                <Iconify icon="solar:check-circle-bold" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Hapus">
            <IconButton size="small" color="error" onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------------

function TableRow({ children, hover, ...other }) {
  return (
    <Box
      component="tr"
      sx={[
        (theme) => ({
          ...(hover && {
            '&:hover': {
              backgroundColor: theme.vars.palette.action.hover,
            },
          }),
        }),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}

function TableCell({ children, align, sx, ...other }) {
  return (
    <Box
      component="td"
      sx={[
        (theme) => ({
          px: 2,
          py: 2,
          borderBottom: `1px solid ${theme.vars.palette.divider}`,
          textAlign: align || 'left',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}
