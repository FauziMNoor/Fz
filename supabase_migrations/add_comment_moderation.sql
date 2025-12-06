-- Add comment moderation system
-- Run this in Supabase SQL Editor

-- Add status column to post_comments
ALTER TABLE post_comments
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add index for status
CREATE INDEX IF NOT EXISTS idx_post_comments_status ON post_comments(status);

-- Update existing comments to approved (so they don't disappear)
UPDATE post_comments SET status = 'approved' WHERE status IS NULL;

-- Update RLS policy to only show approved comments to public
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;

-- New policy: Only show approved comments OR own comments OR if you're the post owner
CREATE POLICY "View approved comments or own comments"
  ON post_comments FOR SELECT
  USING (
    status = 'approved'
    OR auth.uid() = user_id
    OR auth.uid() IN (
      SELECT user_id FROM user_posts WHERE id = post_comments.post_id
    )
  );

-- Update notification trigger to include comment status
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
    -- Create notification with pending status info
    INSERT INTO notifications (user_id, type, title, message, link, created_by)
    VALUES (
      post_owner_id,
      'comment',
      'New Comment (Pending Approval)',
      COALESCE(commenter_name, 'Someone') || ' commented on your post. Click to approve or reject.',
      '/dashboard/user?comment_id=' || NEW.id,
      NEW.user_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verify
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'post_comments'
AND column_name = 'status';

-- Check existing comments
SELECT id, message, status, created_at
FROM post_comments
ORDER BY created_at DESC
LIMIT 5;
