'use client';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios from 'src/lib/axios';
import { supabase } from 'src/lib/supabase';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setState({ user: null, loading: false });
        console.error(error);
        throw error;
      }

      if (session) {
        const accessToken = session?.access_token;

        // Fetch user profile from database
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Merge session data with profile data
        const userData = {
          ...session,
          ...session?.user,
          ...(profile || {}), // Add profile data (avatar_url, full_name, etc.)
        };

        setState({ user: userData, loading: false });
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } else {
        setState({ user: null, loading: false });
        delete axios.defaults.headers.common.Authorization;
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            id: state.user?.id,
            accessToken: state.user?.access_token,
            displayName: state.user?.full_name || state.user?.user_metadata?.display_name,
            role: state.user?.role ?? 'admin',
            // Ensure all profile fields are available
            avatar_url: state.user?.avatar_url,
            full_name: state.user?.full_name,
            email: state.user?.email,
            phone_number: state.user?.phone_number,
            country: state.user?.country,
            address: state.user?.address,
            state: state.user?.state,
            city: state.user?.city,
            zip_code: state.user?.zip_code,
            bio: state.user?.bio,
            is_public: state.user?.is_public,
            social_facebook: state.user?.social_facebook,
            social_instagram: state.user?.social_instagram,
            social_threads: state.user?.social_threads,
            social_youtube: state.user?.social_youtube,
            notification_preferences: state.user?.notification_preferences,
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
