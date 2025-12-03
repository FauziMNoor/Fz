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
  const { data, error } = await supabase
    .from('posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single();

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

// ============================================
// PROFILES
// ============================================

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) {
    console.error('getUserProfile error:', error);
    throw new Error(error.message || 'Failed to get user profile');
  }
  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, profileData) {
  console.log('updateUserProfile called with:', { userId, profileData });

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('updateUserProfile error:', error);
    throw new Error(error.message || error.code || 'Failed to update user profile');
  }

  console.log('updateUserProfile success:', data);
  return data;
}

// ============================================
// STORAGE
// ============================================

/**
 * Upload avatar to Supabase Storage
 * @param {string} userId - User ID
 * @param {File} file - File object to upload
 * @returns {Promise<string>} - Public URL of uploaded avatar
 */
export async function uploadAvatar(userId, file) {
  console.log('uploadAvatar called with:', { userId, fileName: file.name, fileSize: file.size });

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload file to storage
  const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true, // Replace existing file
  });

  if (error) {
    console.error('uploadAvatar error:', error);
    throw new Error(error.message || error.code || 'Failed to upload avatar');
  }

  console.log('Upload successful:', data);

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  console.log('Public URL:', publicUrl);
  return publicUrl;
}

/**
 * Delete avatar from Supabase Storage
 * @param {string} userId - User ID
 */
export async function deleteAvatar(userId) {
  const { data: files, error: listError } = await supabase.storage.from('avatars').list(userId);

  if (listError) throw listError;

  if (files && files.length > 0) {
    const filePaths = files.map((file) => `${userId}/${file.name}`);
    const { error: deleteError } = await supabase.storage.from('avatars').remove(filePaths);

    if (deleteError) throw deleteError;
  }
}

/**
 * Upload post image to Supabase Storage
 * @param {string} postId - Post ID
 * @param {File} file - File object to upload
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export async function uploadPostImage(postId, file) {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${postId}/${timestamp}.${fileExt}`;

  // Upload file to storage
  const { data, error } = await supabase.storage.from('post-images').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('post-images').getPublicUrl(fileName);

  return publicUrl;
}

// ============================================
// SOCIAL LINKS
// ============================================

/**
 * Update user social links
 */
export async function updateSocialLinks(userId, socialLinks) {
  console.log('updateSocialLinks called with:', { userId, socialLinks });

  const { data, error } = await supabase
    .from('profiles')
    .update({
      social_facebook: socialLinks.facebook,
      social_instagram: socialLinks.instagram,
      social_linkedin: socialLinks.linkedin,
      social_twitter: socialLinks.twitter,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('updateSocialLinks error:', error);
    throw new Error(error.message || 'Failed to update social links');
  }

  console.log('updateSocialLinks success:', data);
  return data;
}

// ============================================
// NOTIFICATIONS
// ============================================

/**
 * Update user notification preferences
 */
export async function updateNotificationPreferences(userId, preferences) {
  console.log('updateNotificationPreferences called with:', { userId, preferences });

  const { data, error } = await supabase
    .from('profiles')
    .update({
      notification_preferences: preferences,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('updateNotificationPreferences error:', error);
    throw new Error(error.message || 'Failed to update notification preferences');
  }

  console.log('updateNotificationPreferences success:', data);
  return data;
}

// ============================================
// PASSWORD
// ============================================

/**
 * Change user password using Supabase Auth
 */
export async function changePassword(newPassword) {
  console.log('changePassword called');

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('changePassword error:', error);
    throw new Error(error.message || 'Failed to change password');
  }

  console.log('changePassword success');
  return data;
}
