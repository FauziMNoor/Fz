'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hooks';

import { _userAbout } from 'src/_mock';
import { getUserProfile, getUserSocialPosts } from 'src/lib/supabase-client';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { ProfileHome } from '../profile-home';
import { ProfileCover } from '../profile-cover';
import { ProfilePortfolio } from '../profile-portfolio';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    value: '',
    label: 'Profile',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
  },
  {
    value: 'portfolio',
    label: 'Portfolio',
    icon: <Iconify width={24} icon="solar:case-round-bold" />,
  },
];

// ----------------------------------------------------------------------

const TAB_PARAM = 'tab';

// User ID untuk public profile
const PUBLIC_USER_ID = 'bb2e61da-8f0c-4f12-9fef-59f82db50d69';

export function PublicProfileView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!PUBLIC_USER_ID || PUBLIC_USER_ID === 'YOUR_USER_ID_HERE') {
      console.warn('PUBLIC_USER_ID not configured');
      return;
    }

    try {
      setPostsLoading(true);
      const data = await getUserSocialPosts(PUBLIC_USER_ID);
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTab === '') {
      fetchPosts();
    }
  }, [selectedTab, fetchPosts]);

  useEffect(() => {
    async function fetchProfile() {
      if (!PUBLIC_USER_ID || PUBLIC_USER_ID === 'YOUR_USER_ID_HERE') {
        console.warn('PUBLIC_USER_ID not configured');
        return;
      }

      try {
        const data = await getUserProfile(PUBLIC_USER_ID);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();
  }, []);

  const createRedirectPath = (currentPath, query) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={profile?.role || 'User'}
          name={profile?.full_name || 'User'}
          avatarUrl={profile?.avatar_url}
          coverUrl={_userAbout.coverUrl}
        />

        <Box
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { md: 3 },
            display: 'flex',
            position: 'absolute',
            bgcolor: 'background.paper',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}
        >
          <Tabs value={selectedTab}>
            {NAV_ITEMS.map((tab) => (
              <Tab
                component={RouterLink}
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label}
                href={createRedirectPath(pathname, tab.value)}
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {selectedTab === '' && (
        <ProfileHome
          info={{
            quote: profile?.bio || '',
            country: profile?.country || '',
            email: profile?.email || '',
            address: profile?.address || '',
            phone_number: profile?.phone_number || '',
            socialLinks: {
              facebook: profile?.social_facebook || '',
              instagram: profile?.social_instagram || '',
              threads: profile?.social_threads || '',
              youtube: profile?.social_youtube || '',
            },
          }}
          posts={posts}
          isPublic
        />
      )}

      {selectedTab === 'portfolio' && <ProfilePortfolio portfolios={[]} isOwner={false} />}
    </Container>
  );
}
