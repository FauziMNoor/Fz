-- Fix RLS policies for user_posts table
-- Run this in Supabase SQL Editor

-- First, check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('user_posts', 'post_likes', 'post_comments')
ORDER BY tablename, policyname;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view all posts" ON user_posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON user_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON user_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON user_posts;

-- Recreate policies with correct syntax
CREATE POLICY "Users can view all posts"
  ON user_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON user_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON user_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON user_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_posts'
ORDER BY policyname;

-- Test if current user can insert
-- This should return your user ID if authenticated
SELECT auth.uid() as current_user_id;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_posts';
