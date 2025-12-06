import { kebabCase } from 'es-toolkit';

import { CONFIG } from 'src/global-config';
import { supabase } from 'src/lib/supabase-client';

import { PostEditView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Post edit | Dashboard - ${CONFIG.appName}` };

async function getPostBySlug(slug) {
  const { data: post, error } = await supabase.from('posts').select('*').eq('slug', slug).single();

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

export default async function Page({ params }) {
  const { title } = await params;

  // Try to get post by slug (title is actually slug in URL)
  const post = await getPostBySlug(title);

  // If post not found, show not found page
  if (!post) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Post Not Found</h1>
        <p>The post with slug "{title}" does not exist.</p>
        <a href="/dashboard/post">← Back to Posts</a>
      </div>
    );
  }

  return <PostEditView post={post} />;
}

// ----------------------------------------------------------------------

/**
 * Static Exports in Next.js
 *
 * NOTE: Disabled for now since we're using Supabase dynamic data
 */
// export async function generateStaticParams() {
//   const { data } = await supabase.from('posts').select('slug').limit(10);
//   return data?.map((post) => ({ title: post.slug })) || [];
// }
