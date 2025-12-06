-- =============================================
-- PORTFOLIO SYSTEM
-- =============================================
-- Description: Tabel untuk menyimpan portfolio items (projects, presentations, achievements)
-- Author: Fauzi M. Noor
-- Created: 2025-12-05
-- =============================================

-- 1. CREATE PORTFOLIOS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Content
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- 'project', 'presentation', 'achievement', 'publication'

  -- Media
  cover_image TEXT,
  images TEXT[], -- Array untuk multiple images

  -- Links & Meta
  link_url TEXT,
  tags TEXT[],

  -- Display
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON public.portfolios(category);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON public.portfolios(featured);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_published ON public.portfolios(is_published);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON public.portfolios(created_at DESC);

-- 3. CREATE TRIGGER FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_portfolios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER trigger_update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolios_updated_at();

-- 4. ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public portfolios are viewable by everyone" ON public.portfolios;
DROP POLICY IF EXISTS "Users can view own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can insert own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can update own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can delete own portfolios" ON public.portfolios;

-- Policy: Anyone can view published portfolios
CREATE POLICY "Public portfolios are viewable by everyone"
  ON public.portfolios
  FOR SELECT
  USING (is_published = true);

-- Policy: Users can view their own portfolios (including drafts)
CREATE POLICY "Users can view own portfolios"
  ON public.portfolios
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own portfolios
CREATE POLICY "Users can insert own portfolios"
  ON public.portfolios
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own portfolios
CREATE POLICY "Users can update own portfolios"
  ON public.portfolios
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own portfolios
CREATE POLICY "Users can delete own portfolios"
  ON public.portfolios
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. STORAGE BUCKET FOR PORTFOLIO IMAGES
-- =============================================
-- Note: Run this in Supabase Dashboard > Storage or via SQL
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for portfolio-images bucket
CREATE POLICY "Public Access for Portfolio Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can upload portfolio images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own portfolio images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own portfolio images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================
-- Uncomment to insert sample portfolio items
/*
INSERT INTO public.portfolios (user_id, title, description, category, cover_image, tags, featured, is_published)
VALUES
  (
    'bb2e61da-8f0c-4f12-9fef-59f82db50d69', -- Replace with your user_id
    'Implementasi Agile di Pesantren',
    'Proyek transformasi digital dan metodologi Agile di lingkungan pesantren modern',
    'project',
    'https://via.placeholder.com/800x600',
    ARRAY['agile', 'education', 'digital transformation'],
    true,
    true
  ),
  (
    'bb2e61da-8f0c-4f12-9fef-59f82db50d69',
    'Presentasi: Kepemimpinan Adaptif',
    'Materi presentasi tentang kepemimpinan adaptif di era perubahan',
    'presentation',
    'https://via.placeholder.com/800x600',
    ARRAY['leadership', 'presentation', 'agile'],
    true,
    true
  );
*/

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Check if table created successfully
-- SELECT * FROM public.portfolios;

-- Check indexes
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'portfolios';

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'portfolios';
