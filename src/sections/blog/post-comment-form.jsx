import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { addPostComment } from 'src/lib/supabase-client';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const CommentSchema = zod.object({
  comment: zod.string().min(1, { message: 'Komentar wajib diisi!' }),
  guestName: zod.string().optional(),
  guestEmail: zod.string().email({ message: 'Email tidak valid' }).optional().or(zod.literal('')),
});

// ----------------------------------------------------------------------

export function PostCommentForm({ postId, onCommentAdded }) {
  const { user } = useAuthContext();

  const defaultValues = {
    comment: '',
    guestName: '',
    guestEmail: '',
  };

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!postId) {
        toast.error('ID Post tidak ditemukan');
        return;
      }

      // If user is logged in, use their ID
      if (user?.id) {
        await addPostComment(postId, user.id, data.comment);
      } else {
        // Guest comment - require name and email
        if (!data.guestName || !data.guestEmail) {
          toast.error('Mohon isi nama dan email Anda');
          return;
        }
        await addPostComment(postId, null, data.comment, data.guestName, data.guestEmail);
      }

      toast.success('Komentar berhasil dikirim! Akan ditampilkan setelah disetujui.');
      reset();

      // Refresh comments list
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      toast.error('Gagal mengirim komentar');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Guest fields - only show if not logged in */}
        {!user && (
          <Box sx={{ gap: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Field.Text name="guestName" placeholder="Nama Anda *" required sx={{ flex: 1 }} />
            <Field.Text
              name="guestEmail"
              placeholder="Email Anda *"
              type="email"
              required
              sx={{ flex: 1 }}
            />
          </Box>
        )}

        <Field.Text name="comment" placeholder="Tulis komentar Anda..." multiline rows={4} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Kirim Komentar
          </Button>
        </Box>
      </Box>
    </Form>
  );
}
