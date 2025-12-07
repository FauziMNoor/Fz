import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';

import { updateNotificationPreferences } from 'src/lib/supabase-client';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    subheader: 'Aktivitas',
    caption: 'Notifikasi terkait aktivitas pada artikel dan konten Anda',
    items: [
      { id: 'activity_comments', label: 'Kirim email ketika ada yang berkomentar di artikel saya' },
      { id: 'activity_answers', label: 'Kirim email ketika ada yang menjawab formulir saya' },
      { id: 'activityFollows', label: 'Kirim email ketika ada yang mengikuti saya' },
    ],
  },
  {
    subheader: 'Aplikasi',
    caption: 'Notifikasi terkait pembaruan dan informasi aplikasi',
    items: [
      { id: 'application_news', label: 'Berita dan pengumuman' },
      { id: 'application_product', label: 'Pembaruan produk mingguan' },
      { id: 'application_blog', label: 'Ringkasan blog mingguan' },
    ],
  },
];

// ----------------------------------------------------------------------

export function AccountNotifications({ initialPreferences, sx, ...other }) {
  const { user } = useAuthContext();

  const methods = useForm({
    defaultValues: { selected: initialPreferences || ['activity_comments', 'application_product'] },
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user?.id) {
        toast.error('Pengguna tidak terautentikasi');
        return;
      }

      console.log('Updating notification preferences:', data);

      // Convert array to object for database storage
      const preferences = {};
      NOTIFICATIONS.forEach((notification) => {
        notification.items.forEach((item) => {
          preferences[item.id] = data.selected.includes(item.id);
        });
      });

      // Update notification preferences in Supabase
      await updateNotificationPreferences(user.id, preferences);

      toast.success('Preferensi notifikasi berhasil diperbarui!');
      console.info('Updated preferences:', preferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
      });
      toast.error(error?.message || 'Gagal memperbarui preferensi notifikasi');
    }
  });

  const getSelected = (selectedItems, item) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card
        sx={[
          {
            p: 3,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {NOTIFICATIONS.map((notification) => (
          <Grid key={notification.subheader} container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ListItemText
                primary={notification.subheader}
                secondary={notification.caption}
                slotProps={{
                  primary: { sx: { typography: 'h6' } },
                  secondary: { sx: { mt: 0.5 } },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                sx={{
                  p: 3,
                  gap: 1,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'background.neutral',
                }}
              >
                <Controller
                  name="selected"
                  control={control}
                  render={({ field }) => (
                    <>
                      {notification.items.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          label={item.label}
                          labelPlacement="start"
                          control={
                            <Switch
                              checked={field.value.includes(item.id)}
                              onChange={() => field.onChange(getSelected(values.selected, item.id))}
                              slotProps={{
                                input: {
                                  id: `${item.label}-switch`,
                                  'aria-label': `${item.label} switch`,
                                },
                              }}
                            />
                          }
                          sx={{ m: 0, width: 1, justifyContent: 'space-between' }}
                        />
                      ))}
                    </>
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        ))}

        <Button type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Simpan Perubahan
        </Button>
      </Card>
    </Form>
  );
}
