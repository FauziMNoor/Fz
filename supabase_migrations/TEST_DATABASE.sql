-- =============================================
-- TEST DATABASE CONNECTION & TABLE
-- =============================================
-- Run this step by step to diagnose the issue
-- =============================================

-- STEP 1: Test basic connection
SELECT NOW() as current_time;
-- Expected: Current timestamp
-- If this fails: Database connection problem

-- STEP 2: Check if table exists
SELECT EXISTS (
  SELECT 1
  FROM information_schema.tables
  WHERE table_name = 'portfolios'
) as table_exists;
-- Expected: true
-- If false: Table not created, need to run migration

-- STEP 3: Check table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'portfolios'
ORDER BY ordinal_position;
-- Expected: 12+ rows showing all columns
-- If empty: Table doesn't exist

-- STEP 4: Check your user ID
SELECT id, email, created_at
FROM auth.users
WHERE email = 'fauzimnoor90@gmail.com';
-- Expected: Your user record
-- Copy the 'id' value for next step

-- STEP 5: Try manual insert (REPLACE YOUR_USER_ID)
-- Uncomment and replace YOUR_USER_ID with the ID from step 4
/*
INSERT INTO public.portfolios (
  user_id,
  title,
  category,
  description,
  featured,
  is_published
) VALUES (
  'YOUR_USER_ID', -- Replace this!
  'Test Portfolio',
  'project',
  'This is a test',
  false,
  true
) RETURNING *;
*/

-- STEP 6: If insert works, check the data
SELECT * FROM public.portfolios ORDER BY created_at DESC LIMIT 5;

-- STEP 7: Clean up test data (optional)
-- DELETE FROM public.portfolios WHERE title = 'Test Portfolio';

-- =============================================
-- DIAGNOSTIC RESULTS
-- =============================================
-- ✅ Step 1 works: Database connection OK
-- ✅ Step 2 returns true: Table exists
-- ✅ Step 3 shows columns: Table structure OK
-- ✅ Step 4 shows user: User exists
-- ✅ Step 5 inserts data: Database ready!
-- ❌ Any step fails: See error message for fix
-- =============================================
