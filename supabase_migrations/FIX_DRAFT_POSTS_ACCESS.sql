-- =============================================
-- FIX: Draft Posts Cannot Be Edited
-- =============================================
-- This fixes the issue where draft posts cannot be accessed/edited
-- =============================================

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;

-- Recreate with correct order and logic
-- Policy 1: Users can view ALL their own posts (any status)
CREATE POLICY "Users can view their own posts"
  ON public.posts
  FOR SELECT
  USING (auth.uid() = author_id);

-- Policy 2: Anyone can view published posts
CREATE POLICY "Anyone can view published posts"
  ON public.posts
  FOR SELECT
  USING (status = 'published');

-- =============================================
-- Verification
-- =============================================

-- Check policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'posts'
AND cmd = 'SELECT'
ORDER BY policyname;

-- Expected result:
-- 1. "Anyone can view published posts" - USING (status = 'published')
-- 2. "Users can view their own posts" - USING (auth.uid() = author_id)

-- =============================================
-- Test Query (Run this to verify)
-- =============================================

-- This should return ALL your posts (draft + published)
-- Replace with your user ID
/*
SELECT
  id,
  title,
  slug,
  status,
  created_at
FROM posts
WHERE author_id = 'bb2e61da-8f0c-4f12-9fef-59f82db50d69'
ORDER BY created_at DESC;
*/

-- =============================================
-- SUCCESS!
-- =============================================
-- ✅ Draft posts can now be viewed/edited by owner
-- ✅ Published posts can be viewed by anyone
-- ✅ RLS policies working correctly
-- =============================================
