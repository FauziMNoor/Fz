-- =============================================
-- SIMPLE PORTFOLIO SETUP (No Complex Verification)
-- =============================================
-- Description: Simple and safe portfolio setup
-- Author: Fauzi M. Noor
-- Created: 2025-12-05
-- Version: 1.3 (Simple & Safe)
-- =============================================

-- STEP 1: CREATE TABLE IF NOT EXISTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 2: ADD MISSING COLUMNS
-- =============================================
DO $$
BEGIN
  -- Add title
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'title') THEN
    ALTER TABLE public.portfolios ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT 'Untitled';
  END IF;

  -- Add description
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'description') THEN
    ALTER TABLE public.portfolios ADD COLUMN description TEXT;
  END IF;

  -- Add category
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'category') THEN
    ALTER TABLE public.portfolios ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT 'project';
  END IF;

  -- Add cover_image
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'cover_image') THEN
    ALTER TABLE public.portfolios ADD COLUMN cover_image TEXT;
  END IF;

  -- Add images
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'images') THEN
    ALTER TABLE public.portfolios ADD COLUMN images TEXT[];
  END IF;

  -- Add link_url
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'link_url') THEN
    ALTER TABLE public.portfolios ADD COLUMN link_url TEXT;
  END IF;

  -- Add tags
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'tags') THEN
    ALTER TABLE public.portfolios ADD COLUMN tags TEXT[];
  END IF;

  -- Add featured
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'featured') THEN
    ALTER TABLE public.portfolios ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;

  -- Add display_order
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'display_order') THEN
    ALTER TABLE public.portfolios ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;

  -- Add is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'is_published') THEN
    ALTER TABLE public.portfolios ADD COLUMN is_published BOOLEAN DEFAULT true;
  END IF;
END $$;

-- STEP 3: CREATE INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON public.portfolios(category);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON public.portfolios(featured);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_published ON public.portfolios(is_published);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON public.portfolios(created_at DESC);

-- STEP 4: CREATE TRIGGER
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

-- STEP 5: ENABLE RLS
-- =============================================
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- STEP 6: DROP OLD POLICIES
-- =============================================
DROP POLICY IF EXISTS "Public portfolios are viewable by everyone" ON public.portfolios;
DROP POLICY IF EXISTS "Users can view own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can insert own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can update own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can delete own portfolios" ON public.portfolios;

-- STEP 7: CREATE NEW POLICIES
-- =============================================
CREATE POLICY "Public portfolios are viewable by everyone"
  ON public.portfolios FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can view own portfolios"
  ON public.portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
  ON public.portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- STEP 8: CREATE STORAGE BUCKET
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- STEP 9: DROP OLD STORAGE POLICIES
-- =============================================
DROP POLICY IF EXISTS "Public Access for Portfolio Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own portfolio images" ON storage.objects;

-- STEP 10: CREATE STORAGE POLICIES
-- =============================================
CREATE POLICY "Public Access for Portfolio Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can upload portfolio images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own portfolio images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own portfolio images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- SIMPLE VERIFICATION (No Complex Queries)
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ PORTFOLIO SYSTEM SETUP COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Migration executed successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '  1. Check table structure below';
  RAISE NOTICE '  2. Test in application';
  RAISE NOTICE '  3. Insert sample data';
  RAISE NOTICE '';
END $$;

-- Show table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'portfolios'
ORDER BY ordinal_position;
