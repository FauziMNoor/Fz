'use client';

import { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';

import { getUserProfile } from 'src/lib/supabase-client';

import { useAuthContext } from 'src/auth/hooks';

import { AccountNotifications } from '../account-notifications';

// ----------------------------------------------------------------------

export function AccountNotificationsView() {
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

  // Convert notification preferences object to array of selected items
  const preferences = profile?.notification_preferences || {};
  const initialPreferences = Object.keys(preferences).filter((key) => preferences[key] === true);

  return <AccountNotifications initialPreferences={initialPreferences} />;
}
