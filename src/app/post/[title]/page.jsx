import { CONFIG } from 'src/global-config';
import { supabase } from 'src/lib/supabase-client';

import { PostDetailsHomeView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Post details - ${CONFIG.appName}` };

async function getPostBySlug(slug) {
  // Only fetch published posts for public page
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published') // Only published posts
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  if (!post) {
    return null;
  }

  // Fetch author profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('id', post.author_id)
    .single();

  // Attach author to post
  post.author = profile
    ? {
        name: profile.full_name || 'Admin',
        avatarUrl: profile.avatar_url || '/assets/images/avatar/avatar-25.webp',
      }
    : {
        name: 'Admin',
        avatarUrl: '/assets/images/avatar/avatar-25.webp',
      };

  return post;
}

async function getLatestPublishedPosts(excludeSlug, limit = 4) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .neq('slug', excludeSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }

  if (!posts || posts.length === 0) {
    return [];
  }

  // Get unique author IDs
  const authorIds = [...new Set(posts.map((p) => p.author_id))];

  // Fetch author profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', authorIds);

  // Map profiles by ID
  const profileMap = {};
  (profiles || []).forEach((profile) => {
    profileMap[profile.id] = {
      name: profile.full_name || 'Admin',
      avatarUrl: profile.avatar_url || '/assets/images/avatar/avatar-25.webp',
    };
  });

  // Attach author to posts
  const postsWithAuthor = posts.map((p) => ({
    ...p,
    author: profileMap[p.author_id] || {
      name: 'Admin',
      avatarUrl: '/assets/images/avatar/avatar-25.webp',
    },
  }));

  return postsWithAuthor;
}

export default async function Page({ params }) {
  const { title } = await params;

  const post = await getPostBySlug(title);
  const latestPosts = await getLatestPublishedPosts(title);

  if (!post) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>📝 Post Not Found</h1>
        <p style={{ marginBottom: '20px' }}>
          The post with slug &quot;{title}&quot; does not exist or is not published yet.
        </p>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
          Note: Only published posts are visible on the public blog page.
          <br />
          Draft posts can only be viewed from the dashboard.
        </p>
        <a href="/post" style={{ color: '#6950E8', textDecoration: 'none' }}>
          ← Back to Blog
        </a>
      </div>
    );
  }

  return <PostDetailsHomeView post={post} latestPosts={latestPosts} />;
}

// ----------------------------------------------------------------------

/**
 * Static Exports in Next.js
 *
 * NOTE: Disabled for now since we're using Supabase dynamic data
 */
// export async function generateStaticParams() {
//   const { data } = await supabase
//     .from('posts')
//     .select('slug')
//     .eq('status', 'published')
//     .limit(10);
//   return data?.map((post) => ({ title: post.slug })) || [];
// }
