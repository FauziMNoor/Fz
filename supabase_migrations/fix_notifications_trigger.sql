-- Fix notifications trigger
-- Run this in Supabase SQL Editor

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS trigger_notify_post_owner ON post_comments;
DROP FUNCTION IF EXISTS notify_post_owner();

-- Recreate function with correct syntax
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

  -- Get commenter name
  SELECT full_name INTO commenter_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Don't notify if commenting on own post
  IF post_owner_id != NEW.user_id THEN
    -- Create notification
    INSERT INTO notifications (user_id, type, title, message, link, created_by)
    VALUES (
      post_owner_id,
      'comment',
      'New Comment (Pending Approval)',
      COALESCE(commenter_name, 'Someone') || ' commented on your post. Click to review.',
      '/dashboard/user',
      NEW.user_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_notify_post_owner
  AFTER INSERT ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_post_owner();

-- Test: Insert a test notification manually
-- Replace 'YOUR_USER_ID' with your actual user ID
-- INSERT INTO notifications (user_id, type, title, message, link)
-- VALUES (
--   'bb2e61da-8f0c-4f12-9fef-59f82db50d69',
--   'comment',
--   'Test Notification',
--   'This is a test notification to verify the system works',
--   '/dashboard/user'
-- );

-- Verify trigger exists
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_notify_post_owner';

-- Check if function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'notify_post_owner';

-- View recent notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
