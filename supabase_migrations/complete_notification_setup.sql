-- Complete Notification System Setup
-- Run this AFTER running diagnose_all_tables.sql to see what's missing
-- This will create everything needed for notifications to work

-- ============================================
-- STEP 1: Ensure notifications table exists
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- STEP 2: Ensure post_comments has status column
-- ============================================

-- Add status column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'post_comments' AND column_name = 'status'
  ) THEN
    ALTER TABLE post_comments
    ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

    -- Set existing comments to approved
    UPDATE post_comments SET status = 'approved' WHERE status IS NULL;
  END IF;
END $$;

-- ============================================
-- STEP 3: Setup RLS for notifications
-- ============================================

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Allow insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- Create new policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 4: Create trigger function
-- ============================================

-- Drop existing
DROP TRIGGER IF EXISTS trigger_notify_post_owner ON post_comments;
DROP FUNCTION IF EXISTS notify_post_owner();

-- Create function
CREATE OR REPLACE FUNCTION notify_post_owner()
RETURNS TRIGGER AS $$
DECLARE
  post_owner_id UUID;
  commenter_name TEXT;
BEGIN
  -- Get post owner ID
  SELECT user_id INTO post_owner_id
  FROM user_posts
  WHERE id = NEW.post_id;

  -- Get commenter name from profiles
  SELECT full_name INTO commenter_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Only notify if:
  -- 1. Post owner is different from commenter
  -- 2. Post owner exists
  IF post_owner_id IS NOT NULL AND post_owner_id != NEW.user_id THEN
    -- Create notification
    INSERT INTO notifications (user_id, type, title, message, link, created_by, is_read)
    VALUES (
      post_owner_id,
      'comment',
      'New Comment (Pending Approval)',
      COALESCE(commenter_name, 'Someone') || ' commented on your post. Click to review.',
      '/dashboard/user',
      NEW.user_id,
      false
    );

    -- Log for debugging
    RAISE NOTICE 'Notification created for user % by %', post_owner_id, NEW.user_id;
  ELSE
    RAISE NOTICE 'No notification: post_owner_id=%, commenter=%', post_owner_id, NEW.user_id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the comment insert
    RAISE WARNING 'Error creating notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_notify_post_owner
  AFTER INSERT ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_post_owner();

-- ============================================
-- STEP 5: Verify everything
-- ============================================

-- Check trigger exists
SELECT
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'trigger_notify_post_owner';

-- Check function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'notify_post_owner';

-- Check RLS policies
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'notifications'
ORDER BY policyname;

-- ============================================
-- STEP 6: Test with manual insert
-- ============================================

-- This will test if the trigger works
-- Replace POST_ID and USER_ID with real values from your database

-- First, get a real post_id and user_id
SELECT
  'Post ID: ' || id as post_info,
  'Owner: ' || user_id as owner_info
FROM user_posts
LIMIT 1;

-- Then test comment insert (replace the IDs below)
-- INSERT INTO post_comments (post_id, user_id, message, status)
-- VALUES (
--   'YOUR_POST_ID_HERE',
--   'DIFFERENT_USER_ID_HERE',
--   'Test comment to trigger notification',
--   'pending'
-- );

-- Check if notification was created
-- SELECT * FROM notifications ORDER BY created_at DESC LIMIT 1;

-- ============================================
-- STEP 7: Grant necessary permissions
-- ============================================

-- Ensure authenticated users can insert comments
GRANT INSERT ON post_comments TO authenticated;
GRANT SELECT ON post_comments TO authenticated;

-- Ensure trigger can insert notifications
GRANT INSERT ON notifications TO authenticated;
GRANT SELECT ON notifications TO authenticated;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Notification system setup complete!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Test by adding a comment from web';
  RAISE NOTICE '2. Check notifications table for new entry';
  RAISE NOTICE '3. Refresh dashboard to see badge';
  RAISE NOTICE '==============================================';
END $$;
