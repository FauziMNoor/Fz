'use client';

import { useState, useEffect } from 'react';

import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { supabase } from 'src/lib/supabase-client';
import { DashboardContent } from 'src/layouts/dashboard';

import { PostEditView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const slug = params.title;

        // Fetch post (RLS will work because this is client-side with auth)
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (postError) {
          console.error('Error fetching post:', postError);
          setError('Post not found');
          setLoading(false);
          return;
        }

        if (!postData) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        // Fetch author profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', postData.author_id)
          .single();

        // Attach author to post
        postData.author = profile
          ? {
              name: profile.full_name || 'Admin',
              avatarUrl: profile.avatar_url || '/assets/images/avatar/avatar-25.webp',
            }
          : {
              name: 'Admin',
              avatarUrl: '/assets/images/avatar/avatar-25.webp',
            };

        setPost(postData);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load post');
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.title]);

  if (loading) {
    return (
      <DashboardContent>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </DashboardContent>
    );
  }

  if (error || !post) {
    return (
      <DashboardContent>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Post Not Found</h1>
          <p>The post with slug "{params.title}" does not exist.</p>
          <button
            type="button"
            onClick={() => router.push(paths.dashboard.post.root)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
          >
            ← Back to Posts
          </button>
        </div>
      </DashboardContent>
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
