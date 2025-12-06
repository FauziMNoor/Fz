-- Fix social columns in profiles table
-- This will ensure the correct social media columns exist
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns if they don't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS social_facebook TEXT,
ADD COLUMN IF NOT EXISTS social_instagram TEXT,
ADD COLUMN IF NOT EXISTS social_threads TEXT,
ADD COLUMN IF NOT EXISTS social_youtube TEXT;

-- Step 2: Drop old columns if they exist (LinkedIn and Twitter)
-- Only if you want to remove them completely
ALTER TABLE profiles
DROP COLUMN IF EXISTS social_linkedin,
DROP COLUMN IF EXISTS social_twitter;

-- Step 3: Add comments to document the columns
COMMENT ON COLUMN profiles.social_facebook IS 'Facebook profile URL';
COMMENT ON COLUMN profiles.social_instagram IS 'Instagram profile URL';
COMMENT ON COLUMN profiles.social_threads IS 'Threads profile URL';
COMMENT ON COLUMN profiles.social_youtube IS 'YouTube channel URL';

-- Step 4: Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name LIKE 'social_%'
ORDER BY column_name;
