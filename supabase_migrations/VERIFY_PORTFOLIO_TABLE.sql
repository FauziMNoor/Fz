-- =============================================
-- VERIFY PORTFOLIO TABLE
-- =============================================
-- Run this to check if portfolio table is ready
-- =============================================

-- 1. Check if table exists
SELECT
  'Table Exists' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'portfolios'
  ) THEN '✅ YES' ELSE '❌ NO' END as status;

-- 2. Check columns
SELECT
  'Columns' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'portfolios'
ORDER BY ordinal_position;

-- 3. Check RLS is enabled
SELECT
  'RLS Enabled' as check_type,
  CASE WHEN relrowsecurity THEN '✅ YES' ELSE '❌ NO' END as status
FROM pg_class
WHERE relname = 'portfolios';

-- 4. Check RLS policies
SELECT
  'RLS Policies' as check_type,
  policyname,
  cmd as command
FROM pg_policies
WHERE tablename = 'portfolios';

-- 5. Check indexes
SELECT
  'Indexes' as check_type,
  indexname
FROM pg_indexes
WHERE tablename = 'portfolios';

-- 6. Try to insert test data (will fail if table not ready)
-- Uncomment to test (replace YOUR_USER_ID)
/*
INSERT INTO public.portfolios (
  user_id,
  title,
  category
) VALUES (
  'YOUR_USER_ID',
  'Test Portfolio',
  'project'
) RETURNING *;
*/

-- 7. Check storage bucket
SELECT
  'Storage Bucket' as check_type,
  id,
  name,
  public
FROM storage.buckets
WHERE id = 'portfolio-images';
