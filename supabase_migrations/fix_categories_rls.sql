-- Fix RLS policies for categories table
-- Run this in Supabase SQL Editor

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'categories'
ORDER BY policyname;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can create categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;

-- Create new policies

-- 1. Anyone can view categories (public read)
CREATE POLICY "Anyone can view categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- 2. Authenticated users can create categories
CREATE POLICY "Authenticated users can create categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3. Authenticated users can update categories
CREATE POLICY "Authenticated users can update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Authenticated users can delete categories
CREATE POLICY "Authenticated users can delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'categories'
ORDER BY policyname;

-- Test if current user is authenticated
SELECT auth.uid() as current_user_id;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'categories';

-- ✅ DONE!
-- Categories table now allows authenticated users to:
-- - View all categories (public)
-- - Create new categories
-- - Update existing categories
-- - Delete categories
