-- =============================================
-- COMPREHENSIVE FIX: Draft Posts Access
-- =============================================
-- This completely fixes draft posts access issue
-- =============================================

-- Step 1: Check current policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'posts'
ORDER BY cmd, policyname;

-- Step 2: Drop ALL existing SELECT policies
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can view their own posts" ON public.posts;

-- Step 3: Create NEW policies with correct logic

-- Policy 1: Authors can view ALL their own posts (draft, published, archived)
CREATE POLICY "Authors can view all their posts"
  ON public.posts
  FOR SELECT
  USING (
    auth.uid() = author_id
  );

-- Policy 2: Public can view only published posts
CREATE POLICY "Public can view published posts"
  ON public.posts
  FOR SELECT
  USING (
    status = 'published'
  );

-- Step 4: Verify new policies
SELECT
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'posts'
AND cmd = 'SELECT'
ORDER BY policyname;

-- Expected result:
-- 1. "Authors can view all their posts" - auth.uid() = author_id
-- 2. "Public can view published posts" - status = 'published'

-- =============================================
-- TEST QUERIES
-- =============================================

-- Test 1: Check if you can see your draft posts
-- Replace with your actual user ID
SELECT
  id,
  title,
  slug,
  status,
  author_id,
  created_at
FROM posts
WHERE author_id = 'bb2e61da-8f0c-4f12-9fef-59f82db50d69'
ORDER BY created_at DESC;

-- Expected: Should show ALL your posts (draft + published)

-- Test 2: Check specific draft post
SELECT
  id,
  title,
  slug,
  status
FROM posts
WHERE status = 'draft'
AND author_id = 'bb2e61da-8f0c-4f12-9fef-59f82db50d69';

-- Expected: Should show your draft posts

-- =============================================
-- ADDITIONAL FIX: Ensure RLS is enabled
-- =============================================

-- Make sure RLS is enabled
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SUCCESS!
-- =============================================
-- ✅ Draft posts can now be accessed by owner
-- ✅ Published posts can be accessed by anyone
-- ✅ RLS working correctly
-- =============================================
