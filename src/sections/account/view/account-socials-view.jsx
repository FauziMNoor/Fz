'use client';

import { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { getUserProfile } from 'src/lib/supabase-client';

import { AccountSocials } from '../account-socials';

// ----------------------------------------------------------------------

export function AccountSocialsView() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const profileData = await getUserProfile(user.id);
          setProfile(profileData);
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const socialLinks = {
    facebook: profile?.social_facebook || '',
    instagram: profile?.social_instagram || '',
    threads: profile?.social_threads || '',
    youtube: profile?.social_youtube || '',
  };

  return <AccountSocials socialLinks={socialLinks} />;
}
