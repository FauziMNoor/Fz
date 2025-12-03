-- Update social links columns in profiles table
-- Replace LinkedIn and Twitter with Threads and YouTube
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns for Threads and YouTube
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS social_threads TEXT,
ADD COLUMN IF NOT EXISTS social_youtube TEXT;

-- Step 2: Drop old columns (LinkedIn and Twitter)
-- Note: If you want to keep the data, you can skip this step
-- or migrate the data first before dropping
ALTER TABLE profiles
DROP COLUMN IF EXISTS social_linkedin,
DROP COLUMN IF EXISTS social_twitter;

-- Step 3: Add comments to document the changes
COMMENT ON COLUMN profiles.social_facebook IS 'Facebook profile URL';
COMMENT ON COLUMN profiles.social_instagram IS 'Instagram profile URL';
COMMENT ON COLUMN profiles.social_threads IS 'Threads profile URL';
COMMENT ON COLUMN profiles.social_youtube IS 'YouTube channel URL';

-- Verify the changes
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'profiles'
-- AND column_name LIKE 'social_%'
-- ORDER BY column_name;

