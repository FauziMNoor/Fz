-- =============================================
-- FIX PORTFOLIOS TABLE - ADD MISSING COLUMNS
-- =============================================
-- Description: Add missing columns to existing portfolios table
-- Author: Fauzi M. Noor
-- Created: 2025-12-05
-- =============================================

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add is_published column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN is_published BOOLEAN DEFAULT true;
    RAISE NOTICE '✅ Added column: is_published';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: is_published';
  END IF;

  -- Add display_order column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN display_order INTEGER DEFAULT 0;
    RAISE NOTICE '✅ Added column: display_order';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: display_order';
  END IF;

  -- Add featured column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'featured'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN featured BOOLEAN DEFAULT false;
    RAISE NOTICE '✅ Added column: featured';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: featured';
  END IF;

  -- Add tags column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'tags'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN tags TEXT[];
    RAISE NOTICE '✅ Added column: tags';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: tags';
  END IF;

  -- Add link_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'link_url'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN link_url TEXT;
    RAISE NOTICE '✅ Added column: link_url';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: link_url';
  END IF;

  -- Add images column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'images'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN images TEXT[];
    RAISE NOTICE '✅ Added column: images';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: images';
  END IF;

  -- Add cover_image column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'cover_image'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN cover_image TEXT;
    RAISE NOTICE '✅ Added column: cover_image';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: cover_image';
  END IF;

  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'category'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT 'project';
    RAISE NOTICE '✅ Added column: category';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: category';
  END IF;

  -- Add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'description'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN description TEXT;
    RAISE NOTICE '✅ Added column: description';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: description';
  END IF;

  -- Add title column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolios' AND column_name = 'title'
  ) THEN
    ALTER TABLE public.portfolios ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT 'Untitled';
    RAISE NOTICE '✅ Added column: title';
  ELSE
    RAISE NOTICE '⏭️  Column already exists: title';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '🎉 Column fix completed!';
END $$;

-- Verify all columns exist
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'portfolios'
ORDER BY ordinal_position;
