-- Diagnose all tables and relationships
-- Run this in Supabase SQL Editor to see the complete picture

-- 1. Check if all required tables exist
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_posts', 'post_comments', 'notifications', 'profiles')
ORDER BY table_name;

-- 2. Check user_posts structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_posts'
ORDER BY ordinal_position;

-- 3. Check post_comments structure (especially status column)
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'post_comments'
ORDER BY ordinal_position;

-- 4. Check notifications structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- 5. Check if trigger exists
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'post_comments'
ORDER BY trigger_name;

-- 6. Check if function exists
SELECT
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'notify_post_owner'
AND routine_schema = 'public';

-- 7. Check RLS policies for notifications
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'notifications'
ORDER BY policyname;

-- 8. Check RLS policies for post_comments
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'post_comments'
ORDER BY policyname;

-- 9. Check if RLS is enabled
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_posts', 'post_comments', 'notifications')
ORDER BY tablename;

-- 10. Check recent comments
SELECT
  id,
  post_id,
  user_id,
  message,
  status,
  created_at
FROM post_comments
ORDER BY created_at DESC
LIMIT 5;

-- 11. Check recent notifications
SELECT
  id,
  user_id,
  type,
  title,
  message,
  is_read,
  created_at
FROM notifications
ORDER BY created_at DESC
LIMIT 5;

-- 12. Check if there are any comments without corresponding notifications
SELECT
  pc.id as comment_id,
  pc.post_id,
  pc.user_id as commenter_id,
  up.user_id as post_owner_id,
  pc.created_at as comment_time,
  (SELECT COUNT(*) FROM notifications n
   WHERE n.created_by = pc.user_id
   AND n.created_at >= pc.created_at) as notification_count
FROM post_comments pc
JOIN user_posts up ON pc.post_id = up.id
WHERE pc.user_id != up.user_id  -- Only comments from others
ORDER BY pc.created_at DESC
LIMIT 5;
