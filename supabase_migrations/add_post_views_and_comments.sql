-- ============================================
-- POST VIEWS COUNTER
-- ============================================

-- Add view_count column to posts table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id
  RETURNING view_count INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- POST COMMENTS TABLE
-- ============================================

-- Create post_comments table if not exists
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id)ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_name TEXT,
  guest_email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_status ON post_comments(status);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);

-- Enable RLS
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_comments

-- Anyone can read approved comments
DROP POLICY IF EXISTS "Anyone can read approved comments" ON post_comments;
CREATE POLICY "Anyone can read approved comments"
  ON post_comments FOR SELECT
  USING (status = 'approved');

-- Authenticated users can read their own comments (any status)
DROP POLICY IF EXISTS "Users can read own comments" ON post_comments;
CREATE POLICY "Users can read own comments"
  ON post_comments FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can insert comments (both logged in and guest)
DROP POLICY IF EXISTS "Anyone can insert comments" ON post_comments;
CREATE POLICY "Anyone can insert comments"
  ON post_comments FOR INSERT
  WITH CHECK (true);

-- Users can update their own comments
DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;
CREATE POLICY "Users can update own comments"
  ON post_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments
DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Post authors can manage all comments on their posts
DROP POLICY IF EXISTS "Post authors can manage comments" ON post_comments;
CREATE POLICY "Post authors can manage comments"
  ON post_comments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_comments.post_id
      AND posts.author_id = auth.uid()
    )
  );

-- ============================================
-- HELPER FUNCTION TO GET COMMENTS WITH USER INFO
-- ============================================

-- This function joins comments with user profiles for display
CREATE OR REPLACE FUNCTION get_post_comments_with_users(p_post_id UUID)
RETURNS TABLE (
  id UUID,
  post_id UUID,
  user_id UUID,
  guest_name TEXT,
  guest_email TEXT,
  message TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  user_name TEXT,
  user_avatar TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pc.id,
    pc.post_id,
    pc.user_id,
    pc.guest_name,
    pc.guest_email,
    pc.message,
    pc.status,
    pc.created_at,
    COALESCE(p.full_name, pc.guest_name) as user_name,
    p.avatar_url as user_avatar
  FROM post_comments pc
  LEFT JOIN profiles p ON pc.user_id = p.id
  WHERE pc.post_id = p_post_id
    AND pc.status = 'approved'
  ORDER BY pc.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_post_comments_with_users(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO authenticated, anon;

