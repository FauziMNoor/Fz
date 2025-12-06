-- =============================================
-- CREATE POSTS TABLE FOR BLOG ARTICLES
-- =============================================
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT NOT NULL,

  -- Media
  cover_url TEXT,

  -- Author
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Status & Publishing
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,

  -- SEO Meta
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],

  -- Tags
  tags TEXT[],

  -- Settings
  enable_comments BOOLEAN DEFAULT true,

  -- Stats
  view_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_posts_updated_at ON public.posts;
CREATE TRIGGER trigger_update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_posts_updated_at();

-- Create function to auto-set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_posts_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to published and published_at is null
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;

  -- If status changed from published to draft, clear published_at
  IF NEW.status = 'draft' AND OLD.status = 'published' THEN
    NEW.published_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-set published_at
DROP TRIGGER IF EXISTS trigger_set_posts_published_at ON public.posts;
CREATE TRIGGER trigger_set_posts_published_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION set_posts_published_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published posts
CREATE POLICY "Anyone can view published posts"
  ON public.posts
  FOR SELECT
  USING (status = 'published');

-- Policy: Authenticated users can view their own posts (any status)
CREATE POLICY "Users can view their own posts"
  ON public.posts
  FOR SELECT
  USING (auth.uid() = author_id);

-- Policy: Authenticated users can create posts
CREATE POLICY "Users can create posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Policy: Users can update their own posts
CREATE POLICY "Users can update their own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Policy: Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- =============================================
-- CREATE CATEGORIES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Pendidikan', 'pendidikan', 'Artikel tentang dunia pendidikan'),
  ('Agile', 'agile', 'Prinsip dan praktik Agile'),
  ('Kepemimpinan', 'kepemimpinan', 'Leadership dan manajemen'),
  ('Pesantren', 'pesantren', 'Kehidupan dan pengalaman di pesantren'),
  ('Teknologi', 'teknologi', 'Teknologi dalam pendidikan'),
  ('Inspirasi', 'inspirasi', 'Cerita inspiratif dan motivasi')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view categories
CREATE POLICY "Anyone can view categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- =============================================
-- CREATE POST_CATEGORIES JUNCTION TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.post_categories (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON public.post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON public.post_categories(category_id);

-- Enable RLS
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view post categories
CREATE POLICY "Anyone can view post categories"
  ON public.post_categories
  FOR SELECT
  USING (true);

-- Policy: Users can manage their post categories
CREATE POLICY "Users can manage their post categories"
  ON public.post_categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_categories.post_id
      AND posts.author_id = auth.uid()
    )
  );

-- =============================================
-- VERIFICATION QUERIES (Optional - Run separately)
-- =============================================

-- Uncomment to verify:

/*
-- Check if table exists
SELECT EXISTS (
  SELECT 1
  FROM information_schema.tables
  WHERE table_name = 'posts'
) as posts_table_exists;

-- Check table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'posts';

-- Check categories
SELECT * FROM categories;
*/

-- =============================================
-- SUCCESS!
-- =============================================
-- ✅ Posts table created with 17 columns
-- ✅ Categories table created with default data
-- ✅ Post_categories junction table created
-- ✅ Indexes created for performance
-- ✅ Auto-update triggers created
-- ✅ RLS policies enabled
-- ✅ Ready to use!
-- =============================================
