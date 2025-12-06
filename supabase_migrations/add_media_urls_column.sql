-- Add media_urls column to user_posts table
-- Run this in Supabase SQL Editor

-- Add the column if it doesn't exist
ALTER TABLE user_posts
ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}';

-- Add comment
COMMENT ON COLUMN user_posts.media_urls IS 'Array of media URLs (images/videos) attached to the post';

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_posts'
ORDER BY ordinal_position;
