-- =============================================
-- CLEAN & CREATE POSTS TABLE
-- =============================================
-- This will DROP existing tables and create fresh ones
-- ⚠️ WARNING: This will delete all existing posts data!
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. DROP EXISTING TABLES (Clean slate)
-- =============================================

-- Drop tables in correct order (dependencies first)
DROP TABLE IF EXISTS public.post_categories CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_posts_updated_at() CASCADE;
DROP FUNCTION IF EXISTS set_posts_published_at() CASCADE;

-- =============================================
-- 2. CREATE POSTS TABLE
-- =============================================

CREATE TABLE public.posts (
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
-- 3. CREATE INDEXES
-- =============================================

CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_tags ON public.posts USING GIN(tags);

-- =============================================
-- 4. CREATE TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_posts_updated_at();

-- Auto-set published_at
CREATE FUNCTION set_posts_published_at()
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

CREATE TRIGGER trigger_set_posts_published_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION set_posts_published_at();

-- =============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published posts
CREATE POLICY "Anyone can view published posts"
  ON public.posts
  FOR SELECT
  USING (status = 'published');

-- Users can view their own posts
CREATE POLICY "Users can view their own posts"
  ON public.posts
  FOR SELECT
  USING (auth.uid() = author_id);

-- Users can create posts
CREATE POLICY "Users can create posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- =============================================
-- 6. CREATE CATEGORIES TABLE
-- =============================================

CREATE TABLE public.categories (
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
  ('Inspirasi', 'inspirasi', 'Cerita inspiratif dan motivasi');

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- =============================================
-- ✅ DONE!
-- =============================================
-- Posts table created fresh with 17 columns
-- Categories table created with 6 default categories
-- All indexes, triggers, and RLS policies applied
-- Ready to use!
-- =============================================
