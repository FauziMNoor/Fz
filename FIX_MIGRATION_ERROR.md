# 🔧 Fix Migration Error - "relation already exists"

**Error:** `ERROR: 42P07: relation "idx_portfolios_user_id" already exists`

---

## 🐛 Problem

Migration sudah pernah dijalankan sebelumnya, sehingga index/table/policy sudah ada di database.

---

## ✅ Solution

### Option 1: Use Safe Migration (Recommended)

Gunakan file migration baru yang aman:

**File:** `supabase_migrations/create_portfolios_safe.sql`

**Features:**

- ✅ `CREATE TABLE IF NOT EXISTS` - Skip jika table sudah ada
- ✅ `CREATE INDEX IF NOT EXISTS` - Skip jika index sudah ada
- ✅ `DROP POLICY IF EXISTS` - Hapus policy lama sebelum buat baru
- ✅ `DROP TRIGGER IF EXISTS` - Hapus trigger lama sebelum buat baru
- ✅ `ON CONFLICT DO NOTHING` - Skip jika bucket sudah ada

**How to run:**

1. Open Supabase SQL Editor:

   ```
   https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql/new
   ```

2. Copy content from: `supabase_migrations/create_portfolios_safe.sql`

3. Paste and click "Run"

4. Should see success messages:

   ```
   ✅ Portfolio table created/verified
   ✅ Indexes created/verified
   ✅ Triggers created/verified
   ✅ RLS policies created/verified
   ✅ Storage bucket created/verified
   ✅ Storage policies created/verified

   🎉 Portfolio system migration completed successfully!
   ```

---

### Option 2: Drop and Recreate (Caution!)

⚠️ **WARNING:** This will delete all existing portfolio data!

```sql
-- Drop everything
DROP TABLE IF EXISTS public.portfolios CASCADE;
DROP POLICY IF EXISTS "Public Access for Portfolio Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own portfolio images" ON storage.objects;

-- Then run the original migration
-- (copy from create_portfolios_table.sql)
```

---

### Option 3: Skip Migration (If Already Complete)

If portfolio system is already working:

1. **Check if table exists:**

   ```sql
   SELECT * FROM public.portfolios LIMIT 1;
   ```

2. **Check if indexes exist:**

   ```sql
   SELECT indexname FROM pg_indexes WHERE tablename = 'portfolios';
   ```

3. **Check if policies exist:**

   ```sql
   SELECT policyname FROM pg_policies WHERE tablename = 'portfolios';
   ```

4. **If all exist:** Migration already complete! ✅

---

## 🧪 Verify Migration

After running safe migration, verify:

### 1. Check Table

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'portfolios';
```

Expected: 1 row

### 2. Check Indexes

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'portfolios';
```

Expected: 5 indexes

- idx_portfolios_user_id
- idx_portfolios_category
- idx_portfolios_featured
- idx_portfolios_is_published
- idx_portfolios_created_at

### 3. Check RLS Policies

```sql
SELECT policyname
FROM pg_policies
WHERE tablename = 'portfolios';
```

Expected: 5 policies

- Public portfolios are viewable by everyone
- Users can view own portfolios
- Users can insert own portfolios
- Users can update own portfolios
- Users can delete own portfolios

### 4. Check Storage Bucket

```sql
SELECT id, name, public
FROM storage.buckets
WHERE id = 'portfolio-images';
```

Expected: 1 row (portfolio-images, true)

### 5. Check Storage Policies

```sql
SELECT name
FROM storage.policies
WHERE bucket_id = 'portfolio-images';
```

Expected: 4 policies

- Public Access for Portfolio Images
- Authenticated users can upload portfolio images
- Users can update own portfolio images
- Users can delete own portfolio images

---

## 📊 Migration Status Check

Run this query to check overall status:

```sql
-- Check table
SELECT
  'portfolios' as object_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'portfolios'
  ) THEN '✅ Exists' ELSE '❌ Missing' END as status

UNION ALL

-- Check indexes
SELECT
  'indexes' as object_type,
  CASE WHEN COUNT(*) = 5 THEN '✅ Complete' ELSE '⚠️ Incomplete' END as status
FROM pg_indexes
WHERE tablename = 'portfolios'

UNION ALL

-- Check RLS policies
SELECT
  'rls_policies' as object_type,
  CASE WHEN COUNT(*) = 5 THEN '✅ Complete' ELSE '⚠️ Incomplete' END as status
FROM pg_policies
WHERE tablename = 'portfolios'

UNION ALL

-- Check storage bucket
SELECT
  'storage_bucket' as object_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM storage.buckets
    WHERE id = 'portfolio-images'
  ) THEN '✅ Exists' ELSE '❌ Missing' END as status

UNION ALL

-- Check storage policies
SELECT
  'storage_policies' as object_type,
  CASE WHEN COUNT(*) = 4 THEN '✅ Complete' ELSE '⚠️ Incomplete' END as status
FROM storage.policies
WHERE bucket_id = 'portfolio-images';
```

Expected output:

```
object_type       | status
------------------|--------------
portfolios        | ✅ Exists
indexes           | ✅ Complete
rls_policies      | ✅ Complete
storage_bucket    | ✅ Exists
storage_policies  | ✅ Complete
```

---

## 🎯 Next Steps

After successful migration:

1. **Test Portfolio Tab:**

   - Visit: http://localhost:3032/dashboard/user?tab=portfolio
   - Should see empty state (no errors)

2. **Add Sample Data:**

   ```sql
   INSERT INTO public.portfolios (
     user_id,
     title,
     description,
     category,
     cover_image,
     tags,
     featured,
     is_published
   ) VALUES (
     'bb2e61da-8f0c-4f12-9fef-59f82db50d69',
     'Test Portfolio',
     'This is a test',
     'project',
     'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
     ARRAY['test'],
     true,
     true
   );
   ```

3. **Refresh Page:**
   - Should see portfolio card!

---

## 🐛 Common Issues

### Issue: "permission denied for table portfolios"

**Solution:** RLS not enabled

```sql
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
```

### Issue: "function update_portfolios_updated_at() does not exist"

**Solution:** Run trigger creation part of migration again

### Issue: Storage policies not working

**Solution:** Re-run storage policies section

---

## 📚 Files

- **Safe Migration:** `supabase_migrations/create_portfolios_safe.sql` ⭐ Use this!
- **Original Migration:** `supabase_migrations/create_portfolios_table.sql`
- **This Guide:** `FIX_MIGRATION_ERROR.md`

---

**Version:** 1.4.1
**Last Updated:** 2025-12-05
**Status:** ✅ Error Fixed
