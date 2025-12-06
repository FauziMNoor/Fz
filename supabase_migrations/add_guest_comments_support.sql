-- Add support for guest comments + moderation
-- Run this in Supabase SQL Editor
-- This combines guest support and comment moderation features

-- ============================================
-- STEP 1: Add columns
-- ============================================

-- Add guest columns
ALTER TABLE post_comments
  ADD COLUMN IF NOT EXISTS guest_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Add status column (if not exists from previous migration)
ALTER TABLE post_comments
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing comments to approved (so they don't disappear)
UPDATE post_comments SET status = 'approved' WHERE status IS NULL;

-- ============================================
-- STEP 2: Make user_id nullable
-- ============================================

ALTER TABLE post_comments
  ALTER COLUMN user_id DROP NOT NULL;

-- ============================================
-- STEP 3: Add constraints
-- ============================================

-- Either user_id OR (guest_name AND guest_email) must be provided
ALTER TABLE post_comments
  DROP CONSTRAINT IF EXISTS check_user_or_guest;

ALTER TABLE post_comments
  ADD CONSTRAINT check_user_or_guest
  CHECK (
    (user_id IS NOT NULL) OR
    (guest_name IS NOT NULL AND guest_email IS NOT NULL)
  );

-- ============================================
-- STEP 4: Update RLS policies
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view all comments" ON post_comments;
DROP POLICY IF EXISTS "Users can create their own comments" ON post_comments;
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
DROP POLICY IF EXISTS "View approved comments or own comments" ON post_comments;

-- SELECT: Show approved comments OR own comments OR if you're the post owner
CREATE POLICY "View approved comments or own comments"
  ON post_comments FOR SELECT
  USING (
    status = 'approved'
    OR auth.uid() = user_id
    OR auth.uid() IN (
      SELECT user_id FROM user_posts WHERE id = post_comments.post_id
    )
  );

-- INSERT: Authenticated users can create comments with their user_id
CREATE POLICY "Authenticated users can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND auth.uid() = user_id
  );

-- INSERT: Guests can create comments without user_id
CREATE POLICY "Guests can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (
    user_id IS NULL AND
    guest_name IS NOT NULL AND
    guest_email IS NOT NULL
  );

-- ============================================
-- STEP 5: Add indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_post_comments_status ON post_comments(status);
CREATE INDEX IF NOT EXISTS idx_post_comments_guest_email ON post_comments(guest_email);

-- ============================================
-- STEP 6: Update notification trigger
-- ============================================

-- Update trigger to handle guest comments
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

  -- Don't notify if commenting on own post (only for authenticated users)
  IF NEW.user_id IS NULL OR post_owner_id != NEW.user_id THEN
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

-- ============================================
-- STEP 7: Add comments
-- ============================================

COMMENT ON COLUMN post_comments.guest_name IS 'Name of guest commenter (if not logged in)';
COMMENT ON COLUMN post_comments.guest_email IS 'Email of guest commenter (if not logged in)';
COMMENT ON COLUMN post_comments.status IS 'Comment moderation status: pending, approved, rejected';

-- ============================================
-- VERIFY
-- ============================================

-- Check columns
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'post_comments'
ORDER BY ordinal_position;

-- Check policies
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'post_comments';

-- Check existing comments
SELECT id, user_id, guest_name, guest_email, status, message, created_at
FROM post_comments
ORDER BY created_at DESC
LIMIT 5;
