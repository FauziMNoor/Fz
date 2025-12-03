import { createClient } from '@supabase/supabase-js';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

/**
 * Supabase client for browser
 */
export const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Helper functions for common Supabase operations
 */

// ============================================
// POSTS
// ============================================

/**
 * Get all published posts
 */
export async function getPublishedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      author:profiles(*),
      categories:post_categories(category:categories(*)),
      tags:post_tags(tag:tags(*))
    `
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      author:profiles(*),
      categories:post_categories(category:categories(*)),
      tags:post_tags(tag:tags(*))
    `
    )
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create new post
 */
export async function createPost(postData) {
  const { data, error } = await supabase.from('posts').insert([postData]).select().single();

  if (error) throw error;
  return data;
}

/**
 * Update post
 */
export async function updatePost(id, postData) {
  const { data, error } = await supabase.from('posts').update(postData).eq('id', id).select().single();

  if (error) throw error;
  return data;
}

/**
 * Delete post
 */
export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) throw error;
}

// ============================================
// CATEGORIES
// ============================================

/**
 * Get all categories
 */
export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');

  if (error) throw error;
  return data;
}

// ============================================
// TAGS
// ============================================

/**
 * Get all tags
 */
export async function getTags() {
  const { data, error } = await supabase.from('tags').select('*').order('name');

  if (error) throw error;
  return data;
}

// ============================================
// COMMENTS
// ============================================

/**
 * Get comments for a post
 */
export async function getPostComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, author:profiles(*)')
    .eq('post_id', postId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create comment
 */
export async function createComment(commentData) {
  const { data, error } = await supabase.from('comments').insert([commentData]).select().single();

  if (error) throw error;
  return data;
}

