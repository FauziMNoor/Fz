import { z as zod } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getUserProfile, updateUserProfile, uploadAvatar } from 'src/lib/supabase-client';

// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
  displayName: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  photoURL: schemaHelper.file({ message: 'Avatar is required!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  country: schemaHelper.nullableInput(zod.string().min(1, { message: 'Country is required!' }), {
    // message for null value
    message: 'Country is required!',
  }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  about: zod.string().min(1, { message: 'About is required!' }),
  // Not required
  isPublic: zod.boolean(),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const profileData = await getUserProfile(user.id);
          setProfile(profileData);
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user?.id]);

  const currentUser = {
    displayName: profile?.full_name || user?.displayName || '',
    email: profile?.email || user?.email || '',
    photoURL: profile?.avatar_url || null,
    phoneNumber: profile?.phone_number || '',
    country: profile?.country || null,
    address: profile?.address || '',
    state: profile?.state || '',
    city: profile?.city || '',
    zipCode: profile?.zip_code || '',
    about: profile?.bio || '',
    isPublic: profile?.is_public || false,
  };

  const defaultValues = {
    displayName: '',
    email: '',
    photoURL: null,
    phoneNumber: '',
    country: null,
    address: '',
    state: '',
    city: '',
    zipCode: '',
    about: '',
    isPublic: false,
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user?.id) {
        toast.error('User not authenticated');
        return;
      }

      console.log('Form data:', data);
      console.log('User ID:', user.id);

      let avatarUrl = profile?.avatar_url;

      // Upload avatar if user selected a new file
      if (data.photoURL && typeof data.photoURL !== 'string') {
        try {
          console.log('Uploading avatar...');
          toast.info('Uploading avatar...');
          avatarUrl = await uploadAvatar(user.id, data.photoURL);
          console.log('Avatar uploaded:', avatarUrl);
          toast.success('Avatar uploaded successfully!');
        } catch (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          console.error('Upload error details:', {
            message: uploadError?.message,
            code: uploadError?.code,
            details: uploadError?.details,
            hint: uploadError?.hint,
          });
          toast.error(
            uploadError?.message || 'Failed to upload avatar. Continuing with profile update...'
          );
          // Continue with profile update even if avatar upload fails
        }
      }

      // Map form data to database fields
      const profileData = {
        full_name: data.displayName,
        email: data.email,
        avatar_url: avatarUrl,
        phone_number: data.phoneNumber,
        country: data.country,
        address: data.address,
        state: data.state,
        city: data.city,
        zip_code: data.zipCode,
        bio: data.about,
        is_public: data.isPublic,
      };

      console.log('Updating profile with data:', profileData);

      // Update profile in Supabase
      const updatedProfile = await updateUserProfile(user.id, profileData);
      setProfile(updatedProfile);

      toast.success('Profile updated successfully!');
      console.info('Updated profile:', updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        stack: error?.stack,
      });
      toast.error(error?.message || error?.code || 'Failed to update profile');
    }
  });

  if (loading) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <Field.Switch
              name="isPublic"
              labelPlacement="start"
              label="Public profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete user
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="displayName" label="Name" />
              <Field.Text name="email" label="Email address" />
              <Field.Phone name="phoneNumber" label="Phone number" />
              <Field.Text name="address" label="Address" />

              <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />

              <Field.Text name="state" label="State/region" />
              <Field.Text name="city" label="City" />
              <Field.Text name="zipCode" label="Zip/code" />
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Field.Text name="about" multiline rows={4} label="About" />

              <Button type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
