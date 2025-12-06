'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';
import {
  getUserPortfolios,
  deletePortfolio,
  getUserProfile,
  getUserPosts,
  deleteUserPost,
  updateUserPost,
} from 'src/lib/supabase-client';

import { ProfileHome } from '../profile-home';
import { ProfileCover } from '../profile-cover';
import { ProfileFriends } from '../profile-friends';
import { ProfilePortfolio } from '../profile-portfolio';
import { ProfileFollowers } from '../profile-followers';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    value: '',
    label: 'Profile',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
  },
  {
    value: 'followers',
    label: 'Followers',
    icon: <Iconify width={24} icon="solar:heart-bold" />,
  },
  {
    value: 'friends',
    label: 'Friends',
    icon: <Iconify width={24} icon="solar:users-group-rounded-bold" />,
  },
  {
    value: 'portfolio',
    label: 'Portfolio',
    icon: <Iconify width={24} icon="solar:case-round-bold" />,
  },
];

// ----------------------------------------------------------------------

const TAB_PARAM = 'tab';

export function UserProfileView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  const { user } = useAuthContext();

  const [searchFriends, setSearchFriends] = useState('');
  const [portfolios, setPortfolios] = useState([]);
  const [portfoliosLoading, setPortfoliosLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Edit post dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  const fetchPortfolios = useCallback(async () => {
    if (!user?.id) return;

    try {
      setPortfoliosLoading(true);
      const data = await getUserPortfolios(user.id);
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast.error('Failed to load portfolios');
    } finally {
      setPortfoliosLoading(false);
    }
  }, [user?.id]);

  const fetchPosts = useCallback(async () => {
    if (!user?.id) return;

    try {
      setPostsLoading(true);
      const data = await getUserPosts(user.id);
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedTab === 'portfolio') {
      fetchPortfolios();
    } else if (selectedTab === '') {
      fetchPosts();
    }
  }, [selectedTab, fetchPortfolios, fetchPosts]);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;

      try {
        const data = await getUserProfile(user.id);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();
  }, [user?.id]);

  const handleEditPortfolio = useCallback(
    (portfolio) => {
      router.push(paths.dashboard.portfolio.edit(portfolio.id));
    },
    [router]
  );

  const handleDeletePortfolio = useCallback(
    async (portfolio) => {
      if (!window.confirm(`Are you sure you want to delete "${portfolio.title}"?`)) {
        return;
      }

      try {
        await deletePortfolio(portfolio.id);
        toast.success('Portfolio deleted successfully!');
        fetchPortfolios(); // Refresh list
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        toast.error('Failed to delete portfolio');
      }
    },
    [fetchPortfolios]
  );

  const handleEditPost = useCallback((post) => {
    setEditingPost(post);
    setEditMessage(post.message);
    setEditDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditingPost(null);
    setEditMessage('');
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editMessage.trim()) {
      toast.error('Please write something');
      return;
    }

    try {
      setIsUpdating(true);
      await updateUserPost(editingPost.id, { message: editMessage.trim() });
      toast.success('Post updated successfully!');
      handleCloseEditDialog();
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  }, [editMessage, editingPost, fetchPosts, handleCloseEditDialog]);

  const handleDeletePost = useCallback(
    async (post) => {
      if (!window.confirm('Are you sure you want to delete this post?')) {
        return;
      }

      try {
        await deleteUserPost(post.id);
        toast.success('Post deleted successfully!');
        fetchPosts(); // Refresh list
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    },
    [fetchPosts]
  );

  const createRedirectPath = (currentPath, query) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: user?.displayName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={profile?.role || 'User'}
          name={profile?.full_name || user?.displayName || user?.email}
          avatarUrl={profile?.avatar_url || user?.photoURL}
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
            email: profile?.email || user?.email,
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
          onPostCreated={fetchPosts}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
      )}

      {selectedTab === 'followers' && <ProfileFollowers followers={_userFollowers} />}

      {selectedTab === 'friends' && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )}

      {selectedTab === 'portfolio' && (
        <ProfilePortfolio
          portfolios={portfolios}
          isOwner
          onEdit={handleEditPortfolio}
          onDelete={handleDeletePortfolio}
        />
      )}

      {/* Edit Post Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            fullWidth
            rows={4}
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            placeholder="What's on your mind?"
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={isUpdating || !editMessage.trim()}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
