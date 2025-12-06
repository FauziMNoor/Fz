-- =============================================
-- CREATE POSTS TABLE - SIMPLE VERSION
-- =============================================
-- Copy & paste this entire file to Supabase SQL Editor
-- Then click "Run" or press Ctrl+Enter
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CREATE POSTS TABLE
-- =============================================

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

  -- Tags (stored as array)
  tags TEXT[],

  -- Settings
  enable_comments BOOLEAN DEFAULT true,

  -- Stats
  view_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. CREATE INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);

-- =============================================
-- 3. CREATE TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_posts_updated_at ON public.posts;
CREATE TRIGGER trigger_update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_posts_updated_at();

-- Auto-set published_at
CREATE OR REPLACE FUNCTION set_posts_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set published_at when status changes to published
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;

  -- Clear published_at when status changes to draft
  IF NEW.status = 'draft' AND OLD.status = 'published' THEN
    NEW.published_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_posts_published_at ON public.posts;
CREATE TRIGGER trigger_set_posts_published_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION set_posts_published_at();

-- =============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published posts
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
CREATE POLICY "Anyone can view published posts"
  ON public.posts
  FOR SELECT
  USING (status = 'published');

-- Users can view their own posts
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
CREATE POLICY "Users can view their own posts"
  ON public.posts
  FOR SELECT
  USING (auth.uid() = author_id);

-- Users can create posts
DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
CREATE POLICY "Users can create posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Users can delete their own posts
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- =============================================
-- 5. CREATE CATEGORIES TABLE
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

-- Anyone can view categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- =============================================
-- ✅ DONE!
-- =============================================
-- Posts table created with 17 columns
-- Categories table created with 6 default categories
-- Indexes created for performance
-- Triggers created for auto-update
-- RLS policies enabled for security
-- =============================================
