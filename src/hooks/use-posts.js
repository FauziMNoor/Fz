import useSWR from 'swr';
import { useMemo } from 'react';

import { getUserPosts } from 'src/lib/supabase-client';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * Custom hook to fetch user's posts from Supabase
 */
export function usePosts() {
  const { user } = useAuthContext();

  const { data, error, isLoading, mutate } = useSWR(
    user?.id ? ['user-posts', user.id] : null,
    () => getUserPosts(user.id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      posts: data || [],
      postsLoading: isLoading,
      postsError: error,
      postsEmpty: !isLoading && !data?.length,
      refreshPosts: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}
