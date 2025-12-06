import { CONFIG } from 'src/global-config';
import { supabase } from 'src/lib/supabase-client';

import { PostListHomeView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Post list - ${CONFIG.appName}` };

async function getPublishedPosts() {
  // Fetch posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  if (!posts || posts.length === 0) {
    return [];
  }

  // Get unique author IDs
  const authorIds = [...new Set(posts.map((post) => post.author_id))];

  // Fetch author profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', authorIds);

  if (profileError) {
    console.error('Error fetching profiles:', profileError);
  }

  // Map profiles by ID
  const profileMap = {};
  (profiles || []).forEach((profile) => {
    profileMap[profile.id] = {
      name: profile.full_name || 'Admin',
      avatarUrl: profile.avatar_url || '/assets/images/avatar/avatar-25.webp',
    };
  });

  // Attach author to posts
  const postsWithAuthor = posts.map((post) => ({
    ...post,
    author: profileMap[post.author_id] || {
      name: 'Admin',
      avatarUrl: '/assets/images/avatar/avatar-25.webp',
    },
  }));

  return postsWithAuthor;
}

export default async function Page() {
  const posts = await getPublishedPosts();

  return <PostListHomeView posts={posts} />;
}
