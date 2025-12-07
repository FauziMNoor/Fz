import { createClient } from '@supabase/supabase-js';

import { CONFIG } from 'src/global-config';

import { logger } from 'src/utils/logger';

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
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug) {
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();

  if (error) throw error;
  return data;
}

/**
 * Create new post with slug generation
 */
export async function createPost(postData) {
  logger.log('Creating post with data:', postData);

  // Generate slug from title if not provided
  if (!postData.slug && postData.title) {
    postData.slug = generateSlug(postData.title);
  }

  const { data, error } = await supabase.from('posts').insert([postData]).select().single();

  if (error) {
    logger.error('Error creating post:', error);
    throw error;
  }

  logger.log('Post created successfully:', data);
  return data;
}

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title) {
  return (
    title
      .toLowerCase()
      .trim()
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove special characters
      .replace(/[^\w-]+/g, '')
      // Replace multiple hyphens with single hyphen
      .replace(/--+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  );
}

/**
 * Update post
 */
export async function updatePost(id, postData) {
  logger.log('Updating post:', id, postData);

  // Update slug if title changed
  if (postData.title && !postData.slug) {
    postData.slug = generateSlug(postData.title);
  }

  const { data, error } = await supabase
    .from('posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Error updating post:', error);
    throw error;
  }

  logger.log('Post updated successfully:', data);
  return data;
}

/**
 * Get user's posts (all statuses)
 */
export async function getUserPosts(userId) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching user posts:', error);
    throw error;
  }

  return data;
}

/**
 * Get post by ID
 */
export async function getPostById(id) {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

  if (error) {
    logger.error('Error fetching post:', error);
    throw error;
  }

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
    logger.error('getUserProfile error:', error);
    throw new Error(error.message || 'Failed to get user profile');
  }
  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, profileData) {
  logger.log('updateUserProfile called with:', { userId, profileData });

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    logger.error('updateUserProfile error:', error);
    throw new Error(error.message || error.code || 'Failed to update user profile');
  }

  logger.log('updateUserProfile success:', data);
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
  logger.log('uploadAvatar called with:', { userId, fileName: file.name, fileSize: file.size });

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload file to storage
  const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true, // Replace existing file
  });

  if (error) {
    logger.error('uploadAvatar error:', error);
    throw new Error(error.message || error.code || 'Failed to upload avatar');
  }

  logger.log('Upload successful:', data);

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  logger.log('Public URL:', publicUrl);
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

/**
 * Upload post images to Supabase Storage
 * @param {string} userId - User ID
 * @param {File[]} files - Array of file objects to upload
 * @returns {Promise<string[]>} - Array of public URLs of uploaded images
 */
export async function uploadPostImages(userId, files) {
  logger.log('uploadPostImages called with:', { userId, fileCount: files.length });

  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const fileName = `${userId}/post_${timestamp}_${randomId}.${fileExt}`;

    // Upload file to storage
    const { data, error } = await supabase.storage.from('post-images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      logger.error('uploadPostImages error:', error);
      throw new Error(error.message || 'Failed to upload post image');
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('post-images').getPublicUrl(fileName);

    return publicUrl;
  });

  const urls = await Promise.all(uploadPromises);
  logger.log('All images uploaded:', urls);
  return urls;
}

/**
 * Upload portfolio cover image to Supabase Storage
 * @param {string} userId - User ID
 * @param {string} portfolioId - Portfolio ID (or temp ID)
 * @param {File} file - File object to upload
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export async function uploadPortfolioCoverImage(userId, portfolioId, file) {
  logger.log('uploadPortfolioCoverImage called with:', {
    userId,
    portfolioId,
    fileName: file.name,
  });

  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${userId}/${portfolioId}_cover_${timestamp}.${fileExt}`;

  // Upload file to storage
  const { data, error } = await supabase.storage.from('portfolio-images').upload(fileName, file, {
    cacheControl: '3600',
    upsert: true, // Replace if exists
  });

  if (error) {
    logger.error('uploadPortfolioCoverImage error:', error);
    throw new Error(error.message || 'Failed to upload portfolio cover image');
  }

  logger.log('Upload successful:', data);

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('portfolio-images').getPublicUrl(fileName);

  logger.log('Public URL:', publicUrl);
  return publicUrl;
}

/**
 * Delete portfolio images from Supabase Storage
 * @param {string} userId - User ID
 * @param {string} portfolioId - Portfolio ID
 */
export async function deletePortfolioImages(userId, portfolioId) {
  const { data: files, error: listError } = await supabase.storage
    .from('portfolio-images')
    .list(`${userId}`);

  if (listError) throw listError;

  if (files && files.length > 0) {
    // Filter files that belong to this portfolio
    const portfolioFiles = files.filter((file) => file.name.includes(portfolioId));

    if (portfolioFiles.length > 0) {
      const filePaths = portfolioFiles.map((file) => `${userId}/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('portfolio-images')
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }
  }
}

// ============================================
// SOCIAL LINKS
// ============================================

/**
 * Update user social links
 */
export async function updateSocialLinks(userId, socialLinks) {
  logger.log('updateSocialLinks called with:', { userId, socialLinks });

  const { data, error } = await supabase
    .from('profiles')
    .update({
      social_facebook: socialLinks.facebook,
      social_instagram: socialLinks.instagram,
      social_threads: socialLinks.threads,
      social_youtube: socialLinks.youtube,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    logger.error('updateSocialLinks error:', error);
    throw new Error(error.message || 'Failed to update social links');
  }

  logger.log('updateSocialLinks success:', data);
  return data;
}

// ============================================
// NOTIFICATIONS
// ============================================

/**
 * Update user notification preferences
 */
export async function updateNotificationPreferences(userId, preferences) {
  logger.log('updateNotificationPreferences called with:', { userId, preferences });

  const { data, error } = await supabase
    .from('profiles')
    .update({
      notification_preferences: preferences,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    logger.error('updateNotificationPreferences error:', error);
    throw new Error(error.message || 'Failed to update notification preferences');
  }

  logger.log('updateNotificationPreferences success:', data);
  return data;
}

// ============================================
// PASSWORD
// ============================================

/**
 * Change user password using Supabase Auth
 */
export async function changePassword(newPassword) {
  logger.log('changePassword called');

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    logger.error('changePassword error:', error);
    throw new Error(error.message || 'Failed to change password');
  }

  logger.log('changePassword success');
  return data;
}

// ============================================
// PORTFOLIOS
// ============================================

/**
 * Get user's portfolios
 */
export async function getUserPortfolios(userId) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('getUserPortfolios error:', error);
    throw new Error(error.message || 'Failed to fetch portfolios');
  }

  return data;
}

/**
 * Create portfolio
 */
export async function createPortfolio(userId, portfolioData) {
  logger.log('createPortfolio called with:', { userId, portfolioData });

  const insertData = {
    user_id: userId,
    ...portfolioData,
  };

  logger.log('Inserting data:', insertData);

  const { data, error } = await supabase.from('portfolios').insert(insertData).select().single();

  if (error) {
    logger.error('createPortfolio error:', error);
    logger.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(error.message || error.hint || 'Failed to create portfolio');
  }

  logger.log('createPortfolio success:', data);
  return data;
}

/**
 * Update portfolio
 */
export async function updatePortfolio(portfolioId, portfolioData) {
  const { data, error } = await supabase
    .from('portfolios')
    .update(portfolioData)
    .eq('id', portfolioId)
    .select()
    .single();

  if (error) {
    logger.error('updatePortfolio error:', error);
    throw new Error(error.message || 'Failed to update portfolio');
  }

  return data;
}

/**
 * Delete portfolio
 */
export async function deletePortfolio(portfolioId) {
  const { error } = await supabase.from('portfolios').delete().eq('id', portfolioId);

  if (error) {
    logger.error('deletePortfolio error:', error);
    throw new Error(error.message || 'Failed to delete portfolio');
  }

  return true;
}

// ============================================
// USER POSTS (Social Media Style)
// ============================================

/**
 * Get user's social media posts with author profile and comments
 */
export async function getUserSocialPosts(userId) {
  logger.log('getUserSocialPosts called with userId:', userId);

  // First get posts
  const { data: posts, error } = await supabase
    .from('user_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('getUserPosts error:', error);
    throw new Error(error.message || 'Failed to fetch posts');
  }

  if (!posts || posts.length === 0) {
    logger.log('No posts found for user:', userId);
    return [];
  }

  logger.log(`Found ${posts.length} posts`);

  // Get post IDs for fetching comments
  const postIds = posts.map((post) => post.id);

  // Fetch comments for all posts (including guest comments)
  const { data: comments, error: commentsError } = await supabase
    .from('post_comments')
    .select('*')
    .in('post_id', postIds)
    .order('created_at', { ascending: true });

  if (commentsError) {
    logger.error('Error fetching comments:', commentsError);
    // Continue without comments if fetch fails
  }

  logger.log(`Found ${comments?.length || 0} comments`);

  // Get unique user IDs from posts and comments (excluding nulls for guests)
  const postUserIds = posts.map((post) => post.user_id);
  const commentUserIds = (comments || [])
    .filter((comment) => comment.user_id)
    .map((comment) => comment.user_id);
  const userIds = [...new Set([...postUserIds, ...commentUserIds])];

  logger.log(`Fetching profiles for ${userIds.length} users`);

  // Fetch profiles for all users
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);

  if (profileError) {
    logger.error('Error fetching profiles:', profileError);
  }

  // Map profiles by ID
  const profileMap = {};
  (profiles || []).forEach((profile) => {
    profileMap[profile.id] = {
      name: profile.full_name,
      avatarUrl: profile.avatar_url,
    };
  });

  // Map comments to posts
  const commentsMap = {};
  (comments || []).forEach((comment) => {
    if (!commentsMap[comment.post_id]) {
      commentsMap[comment.post_id] = [];
    }
    commentsMap[comment.post_id].push({
      ...comment,
      author: comment.user_id ? profileMap[comment.user_id] : null,
    });
  });

  // Attach author and comments to posts
  const postsWithData = posts.map((post) => ({
    ...post,
    author: profileMap[post.user_id] || null,
    comments: commentsMap[post.id] || [],
  }));

  logger.log('getUserPosts success:', postsWithData.length, 'posts with comments');
  return postsWithData;
}

/**
 * Create user post
 */
export async function createUserPost(userId, postData) {
  logger.log('createUserPost called with:', { userId, postData });

  const insertData = {
    user_id: userId,
    message: postData.message,
  };

  // Only add media_urls if it exists in postData and is not empty
  if (postData.media_urls && postData.media_urls.length > 0) {
    insertData.media_urls = postData.media_urls;
  }

  logger.log('Inserting data:', insertData);

  const { data, error } = await supabase.from('user_posts').insert(insertData).select().single();

  if (error) {
    logger.error('createUserPost error:', error);
    logger.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(error.message || error.hint || error.details || 'Failed to create post');
  }

  logger.log('createUserPost success:', data);
  return data;
}

/**
 * Update user post
 */
export async function updateUserPost(postId, postData) {
  const { data, error } = await supabase
    .from('user_posts')
    .update(postData)
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    logger.error('updateUserPost error:', error);
    throw new Error(error.message || 'Failed to update post');
  }

  return data;
}

/**
 * Delete user post
 */
export async function deleteUserPost(postId) {
  const { error } = await supabase.from('user_posts').delete().eq('id', postId);

  if (error) {
    logger.error('deleteUserPost error:', error);
    throw new Error(error.message || 'Failed to delete post');
  }

  return true;
}

// ============================================
// POST LIKES
// ============================================

/**
 * Toggle like on a post
 */
export async function togglePostLike(postId, userId) {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      logger.error('togglePostLike (unlike) error:', error);
      throw new Error(error.message || 'Failed to unlike post');
    }

    return { liked: false };
  }
  // Like
  const { error } = await supabase.from('post_likes').insert({
    post_id: postId,
    user_id: userId,
  });

  if (error) {
    logger.error('togglePostLike (like) error:', error);
    throw new Error(error.message || 'Failed to like post');
  }

  return { liked: true };
}

/**
 * Get post likes count
 */
export async function getPostLikesCount(postId) {
  const { count, error } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (error) {
    logger.error('getPostLikesCount error:', error);
    throw new Error(error.message || 'Failed to get likes count');
  }

  return count || 0;
}

// ============================================
// POST COMMENTS
// ============================================

/**
 * Add comment to post
 * Supports both logged-in users and guest users
 */
export async function addPostComment(postId, userId, message, guestName = null, guestEmail = null) {
  logger.log('addPostComment called with:', { postId, userId, message, guestName, guestEmail });

  const commentData = {
    post_id: postId,
    user_id: userId,
    message,
  };

  // Add guest info if provided
  if (guestName) commentData.guest_name = guestName;
  if (guestEmail) commentData.guest_email = guestEmail;

  const { data, error } = await supabase
    .from('post_comments')
    .insert(commentData)
    .select()
    .single();

  if (error) {
    logger.error('addPostComment error:', error);
    logger.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(error.message || error.hint || error.details || 'Failed to add comment');
  }

  logger.log('addPostComment success:', data);
  return data;
}

/**
 * Delete comment
 */
export async function deletePostComment(commentId) {
  const { error } = await supabase.from('post_comments').delete().eq('id', commentId);

  if (error) {
    logger.error('deletePostComment error:', error);
    throw new Error(error.message || 'Failed to delete comment');
  }

  return true;
}

/**
 * Approve comment (make it visible to public)
 */
export async function approveComment(commentId) {
  const { data, error } = await supabase
    .from('post_comments')
    .update({ status: 'approved' })
    .eq('id', commentId)
    .select()
    .single();

  if (error) {
    logger.error('approveComment error:', error);
    throw new Error(error.message || 'Failed to approve comment');
  }

  return data;
}

/**
 * Reject comment (hide from public)
 */
export async function rejectComment(commentId) {
  const { data, error } = await supabase
    .from('post_comments')
    .update({ status: 'rejected' })
    .eq('id', commentId)
    .select()
    .single();

  if (error) {
    logger.error('rejectComment error:', error);
    throw new Error(error.message || 'Failed to reject comment');
  }

  return data;
}

// ============================================
// ACHIEVEMENTS
// ============================================

/**
 * Get user's achievements
 */
export async function getUserAchievements(userId) {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('display_order', { ascending: true })
    .order('date_received', { ascending: false });

  if (error) {
    logger.error('getUserAchievements error:', error);
    throw new Error(error.message || 'Failed to fetch achievements');
  }

  return data;
}

/**
 * Create achievement
 */
export async function createAchievement(userId, achievementData) {
  const { data, error } = await supabase
    .from('achievements')
    .insert({
      user_id: userId,
      ...achievementData,
    })
    .select()
    .single();

  if (error) {
    logger.error('createAchievement error:', error);
    throw new Error(error.message || 'Failed to create achievement');
  }

  return data;
}

/**
 * Update achievement
 */
export async function updateAchievement(achievementId, achievementData) {
  const { data, error } = await supabase
    .from('achievements')
    .update(achievementData)
    .eq('id', achievementId)
    .select()
    .single();

  if (error) {
    logger.error('updateAchievement error:', error);
    throw new Error(error.message || 'Failed to update achievement');
  }

  return data;
}

/**
 * Delete achievement
 */
export async function deleteAchievement(achievementId) {
  const { error } = await supabase.from('achievements').delete().eq('id', achievementId);

  if (error) {
    logger.error('deleteAchievement error:', error);
    throw new Error(error.message || 'Failed to delete achievement');
  }

  return true;
}

// ============================================
// CERTIFICATIONS
// ============================================

/**
 * Get user's certifications
 */
export async function getUserCertifications(userId) {
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('user_id', userId)
    .order('display_order', { ascending: true })
    .order('issue_date', { ascending: false });

  if (error) {
    logger.error('getUserCertifications error:', error);
    throw new Error(error.message || 'Failed to fetch certifications');
  }

  return data;
}

/**
 * Create certification
 */
export async function createCertification(userId, certificationData) {
  const { data, error } = await supabase
    .from('certifications')
    .insert({
      user_id: userId,
      ...certificationData,
    })
    .select()
    .single();

  if (error) {
    logger.error('createCertification error:', error);
    throw new Error(error.message || 'Failed to create certification');
  }

  return data;
}

/**
 * Update certification
 */
export async function updateCertification(certificationId, certificationData) {
  const { data, error } = await supabase
    .from('certifications')
    .update(certificationData)
    .eq('id', certificationId)
    .select()
    .single();

  if (error) {
    logger.error('updateCertification error:', error);
    throw new Error(error.message || 'Failed to update certification');
  }

  return data;
}

/**
 * Delete certification
 */
export async function deleteCertification(certificationId) {
  const { error } = await supabase.from('certifications').delete().eq('id', certificationId);

  if (error) {
    logger.error('deleteCertification error:', error);
    throw new Error(error.message || 'Failed to delete certification');
  }

  return true;
}

// ============================================
// TEACHING EXPERIENCES
// ============================================

/**
 * Get user's teaching experiences
 */
export async function getUserTeachingExperiences(userId) {
  const { data, error } = await supabase
    .from('teaching_experiences')
    .select('*')
    .eq('user_id', userId)
    .order('display_order', { ascending: true })
    .order('start_date', { ascending: false });

  if (error) {
    logger.error('getUserTeachingExperiences error:', error);
    throw new Error(error.message || 'Failed to fetch teaching experiences');
  }

  return data;
}

/**
 * Create teaching experience
 */
export async function createTeachingExperience(userId, experienceData) {
  const { data, error } = await supabase
    .from('teaching_experiences')
    .insert({
      user_id: userId,
      ...experienceData,
    })
    .select()
    .single();

  if (error) {
    logger.error('createTeachingExperience error:', error);
    throw new Error(error.message || 'Failed to create teaching experience');
  }

  return data;
}

/**
 * Update teaching experience
 */
export async function updateTeachingExperience(experienceId, experienceData) {
  const { data, error } = await supabase
    .from('teaching_experiences')
    .update(experienceData)
    .eq('id', experienceId)
    .select()
    .single();

  if (error) {
    logger.error('updateTeachingExperience error:', error);
    throw new Error(error.message || 'Failed to update teaching experience');
  }

  return data;
}

/**
 * Delete teaching experience
 */
export async function deleteTeachingExperience(experienceId) {
  const { error } = await supabase.from('teaching_experiences').delete().eq('id', experienceId);

  if (error) {
    logger.error('deleteTeachingExperience error:', error);
    throw new Error(error.message || 'Failed to delete teaching experience');
  }

  return true;
}

// ============================================
// CAREER TIMELINE
// ============================================

/**
 * Get user's career timeline
 */
export async function getUserCareerTimeline(userId) {
  const { data, error } = await supabase
    .from('career_timeline')
    .select('*')
    .eq('user_id', userId)
    .order('display_order', { ascending: true })
    .order('event_date', { ascending: false });

  if (error) {
    logger.error('getUserCareerTimeline error:', error);
    throw new Error(error.message || 'Failed to fetch career timeline');
  }

  return data;
}

/**
 * Create career timeline event
 */
export async function createCareerTimelineEvent(userId, eventData) {
  const { data, error } = await supabase
    .from('career_timeline')
    .insert({
      user_id: userId,
      ...eventData,
    })
    .select()
    .single();

  if (error) {
    logger.error('createCareerTimelineEvent error:', error);
    throw new Error(error.message || 'Failed to create career timeline event');
  }

  return data;
}

/**
 * Update career timeline event
 */
export async function updateCareerTimelineEvent(eventId, eventData) {
  const { data, error } = await supabase
    .from('career_timeline')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    logger.error('updateCareerTimelineEvent error:', error);
    throw new Error(error.message || 'Failed to update career timeline event');
  }

  return data;
}

/**
 * Delete career timeline event
 */
export async function deleteCareerTimelineEvent(eventId) {
  const { error } = await supabase.from('career_timeline').delete().eq('id', eventId);

  if (error) {
    logger.error('deleteCareerTimelineEvent error:', error);
    throw new Error(error.message || 'Failed to delete career timeline event');
  }

  return true;
}

// ============================================
// NOTIFICATIONS
// ============================================

/**
 * Get user notifications
 */
export async function getUserNotifications(userId) {
  logger.log('[getUserNotifications] Called with userId:', userId);

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  logger.log('[getUserNotifications] Query result - data:', data);
  logger.log('[getUserNotifications] Query result - error:', error);

  if (error) {
    logger.error('[getUserNotifications] Error details:', JSON.stringify(error, null, 2));
    throw new Error(error.message || 'Failed to fetch notifications');
  }

  logger.log('[getUserNotifications] Returning', data?.length || 0, 'notifications');
  return data || [];
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) {
    logger.error('markNotificationAsRead error:', error);
    throw new Error(error.message || 'Failed to mark notification as read');
  }

  return data;
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    logger.error('markAllNotificationsAsRead error:', error);
    throw new Error(error.message || 'Failed to mark all notifications as read');
  }

  return true;
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId) {
  const { error } = await supabase.from('notifications').delete().eq('id', notificationId);

  if (error) {
    logger.error('deleteNotification error:', error);
    throw new Error(error.message || 'Failed to delete notification');
  }

  return true;
}

// ============================================
// E-BOOKS
// ============================================

/**
 * Get all published e-books
 */
export async function getPublishedEbooks() {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    logger.error('getPublishedEbooks error:', error);
    throw new Error(error.message || 'Failed to fetch e-books');
  }

  return data;
}

/**
 * Get e-book by slug
 */
export async function getEbookBySlug(slug) {
  const { data, error } = await supabase.from('ebooks').select('*').eq('slug', slug).single();

  if (error) {
    logger.error('getEbookBySlug error:', error);
    throw new Error(error.message || 'Failed to fetch e-book');
  }

  return data;
}

/**
 * Get all e-books (for dashboard)
 */
export async function getAllEbooks() {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('getAllEbooks error:', error);
    throw new Error(error.message || 'Failed to fetch e-books');
  }

  return data;
}

/**
 * Get e-books by category
 */
export async function getEbooksByCategory(category) {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('category', category)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    logger.error('getEbooksByCategory error:', error);
    throw new Error(error.message || 'Failed to fetch e-books');
  }

  return data;
}

/**
 * Get own work e-books (written by Fauzi M. Noor)
 */
export async function getOwnWorkEbooks() {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('is_own_work', true)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    logger.error('getOwnWorkEbooks error:', error);
    throw new Error(error.message || 'Failed to fetch own work e-books');
  }

  return data;
}

/**
 * Get featured e-books
 */
export async function getFeaturedEbooks() {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .limit(6);

  if (error) {
    logger.error('getFeaturedEbooks error:', error);
    throw new Error(error.message || 'Failed to fetch featured e-books');
  }

  return data;
}

/**
 * Create e-book
 */
export async function createEbook(ebookData) {
  logger.log('createEbook called with:', ebookData);

  // Generate slug from title if not provided
  if (!ebookData.slug && ebookData.title) {
    ebookData.slug = generateSlug(ebookData.title);
  }

  const { data, error } = await supabase.from('ebooks').insert([ebookData]).select().single();

  if (error) {
    logger.error('createEbook error:', error);
    throw new Error(error.message || 'Failed to create e-book');
  }

  logger.log('createEbook success:', data);
  return data;
}

/**
 * Update e-book
 */
export async function updateEbook(id, ebookData) {
  logger.log('updateEbook called with:', { id, ebookData });

  // Update slug if title changed
  if (ebookData.title && !ebookData.slug) {
    ebookData.slug = generateSlug(ebookData.title);
  }

  const { data, error } = await supabase
    .from('ebooks')
    .update(ebookData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('updateEbook error:', error);
    throw new Error(error.message || 'Failed to update e-book');
  }

  logger.log('updateEbook success:', data);
  return data;
}

/**
 * Delete e-book
 */
export async function deleteEbook(id) {
  const { error } = await supabase.from('ebooks').delete().eq('id', id);

  if (error) {
    logger.error('deleteEbook error:', error);
    throw new Error(error.message || 'Failed to delete e-book');
  }

  return true;
}

/**
 * Increment e-book view count
 */
export async function incrementEbookViewCount(id) {
  const { error } = await supabase.rpc('increment_ebook_view_count', { ebook_id: id });

  if (error) {
    logger.error('incrementEbookViewCount error:', error);
    // Don't throw error, just log it
  }
}

/**
 * Track e-book download
 */
export async function trackEbookDownload(
  ebookId,
  userId = null,
  ipAddress = null,
  userAgent = null
) {
  logger.log('trackEbookDownload called with:', { ebookId, userId });

  const downloadData = {
    ebook_id: ebookId,
    user_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
  };

  const { data, error } = await supabase
    .from('ebook_downloads')
    .insert([downloadData])
    .select()
    .single();

  if (error) {
    logger.error('trackEbookDownload error:', error);
    // Don't throw error, just log it (download tracking is not critical)
  }

  return data;
}

/**
 * Get e-book categories
 */
export async function getEbookCategories() {
  const { data, error } = await supabase
    .from('ebook_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('getEbookCategories error:', error);
    throw new Error(error.message || 'Failed to fetch e-book categories');
  }

  return data;
}

/**
 * Get e-book statistics
 */
export async function getEbookStats() {
  // Get total e-books
  const { count: totalEbooks, error: ebooksError } = await supabase
    .from('ebooks')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  // Get total downloads
  const { count: totalDownloads, error: downloadsError } = await supabase
    .from('ebook_downloads')
    .select('*', { count: 'exact', head: true });

  // Get own work count
  const { count: ownWorkCount, error: ownWorkError } = await supabase
    .from('ebooks')
    .select('*', { count: 'exact', head: true })
    .eq('is_own_work', true)
    .eq('status', 'published');

  if (ebooksError || downloadsError || ownWorkError) {
    logger.error('getEbookStats error:', { ebooksError, downloadsError, ownWorkError });
    throw new Error('Failed to fetch e-book statistics');
  }

  return {
    totalEbooks: totalEbooks || 0,
    totalDownloads: totalDownloads || 0,
    ownWorkCount: ownWorkCount || 0,
  };
}

/**
 * Upload e-book cover image to Supabase Storage
 * @param {string} ebookId - E-book ID (or temp ID)
 * @param {File} file - File object to upload
 * @returns {Promise<string>} - Public URL of uploaded cover
 */
export async function uploadEbookCover(ebookId, file) {
  logger.log('uploadEbookCover called with:', { ebookId, fileName: file.name });

  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${ebookId}_cover_${timestamp}.${fileExt}`;

  // Upload file to storage
  const { data, error } = await supabase.storage.from('ebook-covers').upload(fileName, file, {
    cacheControl: '3600',
    upsert: true, // Replace if exists
  });

  if (error) {
    logger.error('uploadEbookCover error:', error);
    throw new Error(error.message || 'Failed to upload e-book cover');
  }

  logger.log('Upload successful:', data);

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('ebook-covers').getPublicUrl(fileName);

  logger.log('Public URL:', publicUrl);
  return publicUrl;
}

/**
 * Delete e-book cover from Supabase Storage
 * @param {string} coverUrl - Cover image URL
 */
export async function deleteEbookCover(coverUrl) {
  if (!coverUrl) return;

  try {
    // Extract filename from URL
    const fileName = coverUrl.split('/').pop();

    const { error } = await supabase.storage.from('ebook-covers').remove([fileName]);

    if (error) {
      logger.error('deleteEbookCover error:', error);
    }
  } catch (err) {
    logger.error('deleteEbookCover error:', err);
  }
}

// ============================================
// MENU BUILDER
// ============================================

/**
 * Get all menus
 */
export async function getMenus() {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .order('location', { ascending: true });

  if (error) {
    logger.error('Error fetching menus:', error);
    throw error;
  }
  return data;
}

/**
 * Get menu by slug
 */
export async function getMenuBySlug(slug) {
  const { data, error } = await supabase.from('menus').select('*').eq('slug', slug).single();

  if (error) {
    logger.error('Error fetching menu:', error);
    throw error;
  }
  return data;
}

/**
 * Get menu by ID
 */
export async function getMenuById(id) {
  const { data, error } = await supabase.from('menus').select('*').eq('id', id).single();

  if (error) {
    logger.error('Error fetching menu:', error);
    throw error;
  }
  return data;
}

/**
 * Get menu by location
 */
export async function getMenuByLocation(location) {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('location', location)
    .eq('is_active', true)
    .single();

  if (error) {
    logger.error('Error fetching menu by location:', error);
    throw error;
  }
  return data;
}

/**
 * Create new menu
 */
export async function createMenu(menuData) {
  const { data, error } = await supabase.from('menus').insert([menuData]).select().single();

  if (error) {
    logger.error('Error creating menu:', error);
    throw error;
  }
  return data;
}

/**
 * Update menu
 */
export async function updateMenu(menuId, menuData) {
  const { data, error } = await supabase
    .from('menus')
    .update(menuData)
    .eq('id', menuId)
    .select()
    .single();

  if (error) {
    logger.error('Error updating menu:', error);
    throw error;
  }
  return data;
}

/**
 * Delete menu
 */
export async function deleteMenu(menuId) {
  const { error } = await supabase.from('menus').delete().eq('id', menuId);

  if (error) {
    logger.error('Error deleting menu:', error);
    throw error;
  }
  return true;
}

/**
 * Get menu items by menu ID (hierarchical)
 */
export async function getMenuItems(menuId) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('menu_id', menuId)
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Error fetching menu items:', error);
    throw error;
  }

  // Build hierarchical structure
  return buildMenuTree(data);
}

/**
 * Get all menu items (flat)
 */
export async function getAllMenuItems(menuId) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('menu_id', menuId)
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Error fetching menu items:', error);
    throw error;
  }
  return data;
}

/**
 * Get menu item by ID
 */
export async function getMenuItemById(itemId) {
  const { data, error } = await supabase.from('menu_items').select('*').eq('id', itemId).single();

  if (error) {
    logger.error('Error fetching menu item:', error);
    throw error;
  }
  return data;
}

/**
 * Create menu item
 */
export async function createMenuItem(itemData) {
  const { data, error } = await supabase.from('menu_items').insert([itemData]).select().single();

  if (error) {
    logger.error('Error creating menu item:', error);
    throw error;
  }
  return data;
}

/**
 * Update menu item
 */
export async function updateMenuItem(itemId, itemData) {
  const { data, error } = await supabase
    .from('menu_items')
    .update(itemData)
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    logger.error('Error updating menu item:', error);
    throw error;
  }
  return data;
}

/**
 * Delete menu item
 */
export async function deleteMenuItem(itemId) {
  const { error } = await supabase.from('menu_items').delete().eq('id', itemId);

  if (error) {
    logger.error('Error deleting menu item:', error);
    throw error;
  }
  return true;
}

/**
 * Reorder menu items
 */
export async function reorderMenuItems(items) {
  const updates = items.map((item, index) => ({
    id: item.id,
    display_order: index + 1,
  }));

  const { error } = await supabase.from('menu_items').upsert(updates);

  if (error) {
    logger.error('Error reordering menu items:', error);
    throw error;
  }
  return true;
}

/**
 * Build hierarchical menu tree from flat array
 */
function buildMenuTree(items) {
  const itemMap = {};
  const tree = [];

  // Create a map of items by ID
  items.forEach((item) => {
    itemMap[item.id] = { ...item, children: [] };
  });

  // Build the tree
  items.forEach((item) => {
    if (item.parent_id === null) {
      tree.push(itemMap[item.id]);
    } else if (itemMap[item.parent_id]) {
      itemMap[item.parent_id].children.push(itemMap[item.id]);
    }
  });

  return tree;
}

/**
 * Get active menu with items for public display
 */
export async function getPublicMenu(location) {
  try {
    // Get menu by location
    const menu = await getMenuByLocation(location);

    if (!menu) return null;

    // Get menu items
    const { data: items, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('menu_id', menu.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    // Build tree
    const tree = buildMenuTree(items);

    return {
      ...menu,
      items: tree,
    };
  } catch (error) {
    logger.error('Error fetching public menu:', error);
    return null;
  }
}
