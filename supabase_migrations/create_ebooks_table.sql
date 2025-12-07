-- ============================================
-- E-BOOKS SYSTEM MIGRATION
-- ============================================
-- Description: Database schema for e-book library system
-- Author: Fauzi M. Noor
-- Date: 2025-12-07
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: ebooks
-- ============================================
-- Stores e-book information with Google Drive integration
CREATE TABLE IF NOT EXISTS ebooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Information
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,

  -- Google Drive Integration
  google_drive_url TEXT NOT NULL,
  file_size TEXT,                    -- e.g., "2.5 MB", "1.8 MB"
  file_format TEXT DEFAULT 'PDF',    -- "PDF", "EPUB", "MOBI"

  -- Author Information
  author_name TEXT NOT NULL,
  is_own_work BOOLEAN DEFAULT false, -- TRUE if written by Fauzi M. Noor

  -- Categorization
  category TEXT,                     -- "tauhid", "fiqh", "sirah", "pendidikan", "kepemimpinan"
  tags TEXT[],                       -- Array of tags

  -- Statistics
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,

  -- Display Options
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'published',   -- "published", "draft", "archived"

  -- Metadata
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('published', 'draft', 'archived')),
  CONSTRAINT valid_format CHECK (file_format IN ('PDF', 'EPUB', 'MOBI', 'DOCX'))
);

-- ============================================
-- TABLE: ebook_categories
-- ============================================
-- Predefined categories for e-books
CREATE TABLE IF NOT EXISTS ebook_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,                         -- Icon name for UI
  color TEXT,                        -- Color code for UI
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: ebook_downloads
-- ============================================
-- Track e-book downloads for analytics
CREATE TABLE IF NOT EXISTS ebook_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ebook_id UUID NOT NULL REFERENCES ebooks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL for guest downloads
  ip_address TEXT,
  user_agent TEXT,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
-- Performance indexes for common queries

-- E-books indexes
CREATE INDEX IF NOT EXISTS idx_ebooks_slug ON ebooks(slug);
CREATE INDEX IF NOT EXISTS idx_ebooks_category ON ebooks(category);
CREATE INDEX IF NOT EXISTS idx_ebooks_is_own_work ON ebooks(is_own_work);
CREATE INDEX IF NOT EXISTS idx_ebooks_status ON ebooks(status);
CREATE INDEX IF NOT EXISTS idx_ebooks_published_at ON ebooks(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ebooks_featured ON ebooks(is_featured) WHERE is_featured = true;

-- Downloads indexes
CREATE INDEX IF NOT EXISTS idx_ebook_downloads_ebook_id ON ebook_downloads(ebook_id);
CREATE INDEX IF NOT EXISTS idx_ebook_downloads_user_id ON ebook_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_ebook_downloads_date ON ebook_downloads(downloaded_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ebooks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ebooks_updated_at
  BEFORE UPDATE ON ebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_ebooks_updated_at();

-- Auto-update download_count when new download is tracked
CREATE OR REPLACE FUNCTION increment_ebook_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ebooks
  SET download_count = download_count + 1
  WHERE id = NEW.ebook_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_download_count
  AFTER INSERT ON ebook_downloads
  FOR EACH ROW
  EXECUTE FUNCTION increment_ebook_download_count();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_downloads ENABLE ROW LEVEL SECURITY;

-- Policies for ebooks table

-- Public can view published e-books
CREATE POLICY "Public can view published ebooks"
  ON ebooks FOR SELECT
  USING (status = 'published');

-- Authenticated users can view all e-books (including drafts if they're admin)
CREATE POLICY "Authenticated users can view all ebooks"
  ON ebooks FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can insert e-books
CREATE POLICY "Authenticated users can insert ebooks"
  ON ebooks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update e-books
CREATE POLICY "Authenticated users can update ebooks"
  ON ebooks FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete e-books
CREATE POLICY "Authenticated users can delete ebooks"
  ON ebooks FOR DELETE
  TO authenticated
  USING (true);

-- Policies for ebook_categories table

-- Everyone can view categories
CREATE POLICY "Anyone can view ebook categories"
  ON ebook_categories FOR SELECT
  USING (true);

-- Only authenticated users can manage categories
CREATE POLICY "Authenticated users can manage categories"
  ON ebook_categories FOR ALL
  TO authenticated
  USING (true);

-- Policies for ebook_downloads table

-- Anyone can insert download records
CREATE POLICY "Anyone can track downloads"
  ON ebook_downloads FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view download records
CREATE POLICY "Authenticated users can view downloads"
  ON ebook_downloads FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- SEED DATA: Default Categories
-- ============================================

INSERT INTO ebook_categories (name, slug, description, icon, color, display_order) VALUES
  ('Tauhid & Aqidah', 'tauhid-aqidah', 'E-book tentang tauhid dan aqidah Islam', 'solar:mosque-bold-duotone', '#6950E8', 1),
  ('Fiqh', 'fiqh', 'E-book tentang fiqh dan hukum Islam', 'solar:book-bold-duotone', '#00A76F', 2),
  ('Sirah Nabawiyah', 'sirah', 'E-book tentang sejarah Nabi Muhammad SAW', 'solar:history-bold-duotone', '#00B8D9', 3),
  ('Pendidikan', 'pendidikan', 'E-book tentang pendidikan dan pembelajaran', 'solar:graduation-bold-duotone', '#FFAB00', 4),
  ('Kepemimpinan', 'kepemimpinan', 'E-book tentang kepemimpinan dan manajemen', 'solar:crown-bold-duotone', '#8E33FF', 5),
  ('Pengembangan Diri', 'pengembangan-diri', 'E-book tentang pengembangan diri dan motivasi', 'solar:star-bold-duotone', '#22C55E', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample e-books
/*
INSERT INTO ebooks (
  title,
  slug,
  description,
  cover_image_url,
  google_drive_url,
  file_size,
  file_format,
  author_name,
  is_own_work,
  category,
  tags,
  status,
  is_featured,
  published_at
) VALUES
  (
    'Tauhid dalam Kehidupan Sehari-hari',
    'tauhid-dalam-kehidupan-sehari-hari',
    'Panduan praktis mengamalkan tauhid dalam kehidupan sehari-hari dengan pendekatan yang mudah dipahami.',
    'https://example.com/cover1.jpg',
    'https://drive.google.com/file/d/xxxxx/view',
    '2.5 MB',
    'PDF',
    'Fauzi M. Noor',
    true,
    'tauhid-aqidah',
    ARRAY['tauhid', 'aqidah', 'islam'],
    'published',
    true,
    NOW()
  ),
  (
    'Fiqh Ibadah Praktis',
    'fiqh-ibadah-praktis',
    'Panduan lengkap fiqh ibadah untuk kehidupan sehari-hari.',
    'https://example.com/cover2.jpg',
    'https://drive.google.com/file/d/yyyyy/view',
    '3.2 MB',
    'PDF',
    'Fauzi M. Noor',
    true,
    'fiqh',
    ARRAY['fiqh', 'ibadah', 'praktis'],
    'published',
    true,
    NOW()
  ),
  (
    'Sirah Nabi Muhammad SAW',
    'sirah-nabi-muhammad-saw',
    'Kisah lengkap perjalanan hidup Rasulullah SAW.',
    'https://example.com/cover3.jpg',
    'https://drive.google.com/file/d/zzzzz/view',
    '4.1 MB',
    'PDF',
    'Syaikh Muhammad al-Ghazali',
    false,
    'sirah',
    ARRAY['sirah', 'nabi', 'sejarah'],
    'published',
    false,
    NOW()
  );
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables are created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'ebook%';

-- Check categories
-- SELECT * FROM ebook_categories ORDER BY display_order;

-- Check e-books
-- SELECT id, title, author_name, is_own_work, category, status FROM ebooks;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify tables are created
-- 3. Add helper functions in supabase-client.js
-- 4. Create UI components for e-book pages
-- ============================================
