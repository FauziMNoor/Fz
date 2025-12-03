-- Setup Supabase Storage for avatars and images
-- Run this in Supabase SQL Editor

-- Create storage bucket for avatars (if not exists via UI)
-- Note: Buckets are usually created via Supabase Dashboard UI
-- This is just for reference

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to avatars
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage bucket for blog post images
-- Policy: Allow public read access to post images
CREATE POLICY "Public Access to Post Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- Policy: Allow authenticated users to upload post images
CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update post images
CREATE POLICY "Authenticated users can update post images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete post images
CREATE POLICY "Authenticated users can delete post images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);

