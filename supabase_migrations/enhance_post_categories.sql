-- ============================================
-- ENHANCE POST CATEGORIES MIGRATION
-- ============================================
-- Description: Add icon, color, and display_order to categories table
-- Author: Fauzi M. Noor
-- Date: 2025-12-07
-- ============================================

-- Add new columns to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing categories with default values
UPDATE categories SET
  icon = CASE
    WHEN slug = 'pendidikan' THEN 'solar:graduation-bold-duotone'
    WHEN slug = 'agile' THEN 'solar:lightbulb-bold-duotone'
    WHEN slug = 'kepemimpinan' THEN 'solar:crown-bold-duotone'
    WHEN slug = 'pesantren' THEN 'solar:mosque-bold-duotone'
    WHEN slug = 'teknologi' THEN 'solar:laptop-bold-duotone'
    WHEN slug = 'pengembangan-diri' THEN 'solar:star-bold-duotone'
    ELSE 'solar:document-text-bold-duotone'
  END,
  color = CASE
    WHEN slug = 'pendidikan' THEN '#FFAB00'
    WHEN slug = 'agile' THEN '#00B8D9'
    WHEN slug = 'kepemimpinan' THEN '#8E33FF'
    WHEN slug = 'pesantren' THEN '#6950E8'
    WHEN slug = 'teknologi' THEN '#00A76F'
    WHEN slug = 'pengembangan-diri' THEN '#22C55E'
    ELSE '#6950E8'
  END,
  display_order = CASE
    WHEN slug = 'pendidikan' THEN 1
    WHEN slug = 'agile' THEN 2
    WHEN slug = 'kepemimpinan' THEN 3
    WHEN slug = 'pesantren' THEN 4
    WHEN slug = 'teknologi' THEN 5
    WHEN slug = 'pengembangan-diri' THEN 6
    ELSE 99
  END
WHERE icon IS NULL OR color IS NULL OR display_order = 0;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if columns are added
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'categories' AND column_name IN ('icon', 'color', 'display_order');

-- Check updated data
-- SELECT id, name, slug, icon, color, display_order FROM categories ORDER BY display_order;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify columns are added
-- 3. Check data is updated
-- 4. Test Post Category Management UI
-- ============================================
