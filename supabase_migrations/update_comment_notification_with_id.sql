-- Update comment notification to include comment_id in link
-- This allows approve/reject actions from notification drawer

-- Drop and recreate the trigger function
DROP TRIGGER IF EXISTS trigger_notify_post_owner ON post_comments;
DROP FUNCTION IF EXISTS notify_post_owner();

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

  -- Get commenter name (from profile or guest name)
  IF NEW.user_id IS NOT NULL THEN
    SELECT full_name INTO commenter_name
    FROM profiles
    WHERE id = NEW.user_id;
  ELSE
    commenter_name := NEW.guest_name;
  END IF;

  -- Only notify if:
  -- 1. Post owner exists
  -- 2. Not commenting on own post (for authenticated users)
  IF post_owner_id IS NOT NULL AND (NEW.user_id IS NULL OR post_owner_id != NEW.user_id) THEN
    -- Create notification with comment_id in link
    INSERT INTO notifications (user_id, type, title, message, link, created_by, is_read)
    VALUES (
      post_owner_id,
      'comment',
      'New Comment (Pending Approval)',
      COALESCE(commenter_name, 'Someone') || ' commented on your post.',
      '/dashboard/user?comment_id=' || NEW.id,  -- Include comment_id
      NEW.user_id,
      false
    );

    RAISE NOTICE 'Notification created for user % about comment %', post_owner_id, NEW.id;
  ELSE
    RAISE NOTICE 'No notification: post_owner_id=%, commenter=%', post_owner_id, NEW.user_id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER trigger_notify_post_owner
  AFTER INSERT ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_post_owner();

-- Verify
SELECT
  trigger_name,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'trigger_notify_post_owner';

-- Test query to see notification format
SELECT id, type, title, message, link, created_at
FROM notifications
WHERE type = 'comment'
ORDER BY created_at DESC
LIMIT 5;
