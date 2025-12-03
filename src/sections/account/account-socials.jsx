import { useForm } from 'react-hook-form';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';

import { toast } from 'src/components/snackbar';
import { SocialIcon } from 'src/components/social-icon';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { updateSocialLinks } from 'src/lib/supabase-client';

// ----------------------------------------------------------------------

export function AccountSocials({ socialLinks }) {
  const { user } = useAuthContext();

  const defaultValues = {
    facebook: '',
    instagram: '',
    threads: '',
    youtube: '',
  };

  const methods = useForm({
    defaultValues,
    values: socialLinks,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user?.id) {
        toast.error('User not authenticated');
        return;
      }

      console.log('Updating social links:', data);

      // Update social links in Supabase
      await updateSocialLinks(user.id, data);

      toast.success('Social links updated successfully!');
      console.info('Updated social links:', data);
    } catch (error) {
      console.error('Error updating social links:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
      });
      toast.error(error?.message || 'Failed to update social links');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {Object.keys(socialLinks).map((social) => (
          <Field.Text
            key={social}
            name={social}
            label={social.charAt(0).toUpperCase() + social.slice(1)}
            placeholder={`Enter your ${social.charAt(0).toUpperCase() + social.slice(1)} URL`}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SocialIcon name={social} />
                  </InputAdornment>
                ),
              },
            }}
          />
        ))}

        <Button type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save changes
        </Button>
      </Card>
    </Form>
  );
}
