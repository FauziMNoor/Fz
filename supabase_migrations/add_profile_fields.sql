-- Add additional fields to profiles table for user account settings
-- Run this in Supabase SQL Editor

-- Add new columns to profiles table for General tab
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add columns for Social Links tab
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS social_facebook TEXT,
ADD COLUMN IF NOT EXISTS social_instagram TEXT,
ADD COLUMN IF NOT EXISTS social_linkedin TEXT,
ADD COLUMN IF NOT EXISTS social_twitter TEXT;

-- Add column for Notification Preferences tab
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "activity_comments": true,
  "activity_answers": false,
  "activityFollows": false,
  "application_news": false,
  "application_product": true,
  "application_blog": false
}'::jsonb;

-- Add comments to document the changes
COMMENT ON COLUMN profiles.phone_number IS 'User phone number';
COMMENT ON COLUMN profiles.country IS 'User country';
COMMENT ON COLUMN profiles.address IS 'User street address';
COMMENT ON COLUMN profiles.state IS 'User state/region';
COMMENT ON COLUMN profiles.city IS 'User city';
COMMENT ON COLUMN profiles.zip_code IS 'User zip/postal code';
COMMENT ON COLUMN profiles.is_public IS 'Whether the profile is public or private';
COMMENT ON COLUMN profiles.social_facebook IS 'Facebook profile URL';
COMMENT ON COLUMN profiles.social_instagram IS 'Instagram profile URL';
COMMENT ON COLUMN profiles.social_linkedin IS 'LinkedIn profile URL';
COMMENT ON COLUMN profiles.social_twitter IS 'Twitter/X profile URL';
COMMENT ON COLUMN profiles.notification_preferences IS 'User notification preferences stored as JSON';

