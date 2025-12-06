# 🚀 Deployment Instructions - Portfolio System

## Quick Start

Ikuti langkah-langkah ini untuk deploy Portfolio System ke Supabase:

---

## Step 1: Run Database Migrations

### Option A: Supabase Dashboard (Recommended)

1. **Buka Supabase SQL Editor:**

   - Go to: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql/new

2. **Run Migration 1 - Portfolios Table:**

   - Copy seluruh isi file: `supabase_migrations/create_portfolios_table.sql`
   - Paste ke SQL Editor
   - Click **"Run"** button
   - Tunggu sampai muncul "Success" message

3. **Run Migration 2 - Profile Extensions:**
   - Copy seluruh isi file: `supabase_migrations/create_profile_extensions_complete.sql`
   - Paste ke SQL Editor
   - Click **"Run"** button
   - Tunggu sampai muncul "Success" message

### Option B: Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref nvppnowugnjfvquvibqc

# Push migrations
supabase db push
```

---

## Step 2: Verify Database Setup

### Check Tables Created

Go to: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor

You should see these new tables:

- ✅ `portfolios`
- ✅ `user_posts`
- ✅ `post_likes`
- ✅ `post_comments`
- ✅ `achievements`
- ✅ `certifications`
- ✅ `teaching_experiences`
- ✅ `career_timeline`

### Check Storage Bucket

Go to: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/storage/buckets

You should see:

- ✅ `portfolio-images` (public bucket)

### Test RLS Policies

Run this query in SQL Editor:

```sql
-- Check RLS policies for portfolios
SELECT * FROM pg_policies WHERE tablename = 'portfolios';

-- Should return 5 policies:
-- 1. Public portfolios are viewable by everyone
-- 2. Users can view own portfolios
-- 3. Users can insert own portfolios
-- 4. Users can update own portfolios
-- 5. Users can delete own portfolios
```

---

## Step 3: Test the Application

### Start Development Server

```bash
yarn dev
```

### Test Portfolio Tab

1. Navigate to: http://localhost:3032/tentang-saya?tab=portfolio
2. You should see:
   - ✅ Category filter buttons (All, Projects, Presentations, Achievements, Publications)
   - ✅ Empty state message: "No portfolio items yet"
   - ✅ No errors in browser console

### Test with Sample Data (Optional)

Run this in Supabase SQL Editor to add sample portfolio:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID
-- You can get it from: SELECT id FROM auth.users WHERE email = 'fauzimnoor90@gmail.com';

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
  'bb2e61da-8f0c-4f12-9fef-59f82db50d69', -- Your user ID
  'Implementasi Agile di Pesantren',
  'Proyek transformasi digital dan metodologi Agile di lingkungan pesantren modern. Menerapkan Scrum framework untuk meningkatkan efisiensi pembelajaran.',
  'project',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
  ARRAY['agile', 'education', 'digital transformation', 'scrum'],
  true,
  true
);

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
  'Presentasi: Kepemimpinan Adaptif',
  'Materi presentasi tentang kepemimpinan adaptif di era perubahan. Membahas strategi leadership dalam menghadapi disrupsi.',
  'presentation',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
  ARRAY['leadership', 'presentation', 'agile', 'management'],
  true,
  true
);

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
  'Penghargaan Inovasi Pendidikan 2024',
  'Menerima penghargaan dari Kementerian Pendidikan untuk inovasi dalam penerapan teknologi di pesantren.',
  'achievement',
  'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800',
  ARRAY['award', 'innovation', 'education'],
  false,
  true
);
```

After running this, refresh the portfolio page and you should see 3 portfolio items!

---

## Step 4: Troubleshooting

### Issue: "relation 'portfolios' does not exist"

**Solution:** Migration belum dijalankan. Ulangi Step 1.

### Issue: "permission denied for table portfolios"

**Solution:** RLS policies belum aktif. Run this:

```sql
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
```

### Issue: Storage bucket not found

**Solution:** Create bucket manually:

1. Go to Storage: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/storage/buckets
2. Click "New bucket"
3. Name: `portfolio-images`
4. Public: ✅ Yes
5. Click "Create bucket"

### Issue: Can't upload images

**Solution:** Check storage policies:

```sql
-- Run this in SQL Editor
SELECT * FROM storage.policies WHERE bucket_id = 'portfolio-images';
```

If no policies found, run the storage policies section from `create_portfolios_table.sql` again.

---

## Step 5: Next Steps

After successful deployment, you can:

1. **Add Portfolio Items:**

   - Use the SQL query above to add sample data
   - Or wait for Phase 3 (Portfolio Management Dashboard)

2. **Test Category Filters:**

   - Click on different category buttons
   - Verify filtering works correctly

3. **Test Featured Items:**

   - Featured items should appear in "Featured" section at top
   - Regular items appear below

4. **Proceed to Phase 3:**
   - Create dashboard routes for portfolio management
   - Build create/edit forms
   - Implement image upload

---

## 📚 Additional Resources

- **Full Documentation:** `PORTFOLIO_IMPLEMENTATION.md`
- **Main Documentation:** `mulai_dari_sini.md`
- **Supabase Dashboard:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
- **Database Editor:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor
- **Storage:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/storage/buckets

---

## ✅ Deployment Checklist

- [ ] Migration 1 (portfolios table) executed successfully
- [ ] Migration 2 (profile extensions) executed successfully
- [ ] All 8 tables visible in Database Editor
- [ ] Storage bucket `portfolio-images` created
- [ ] RLS policies active (5 policies for portfolios)
- [ ] Development server running without errors
- [ ] Portfolio tab accessible at `/tentang-saya?tab=portfolio`
- [ ] Empty state displays correctly
- [ ] (Optional) Sample data inserted and displays correctly

---

**Need Help?**

Check the browser console for errors, or review the migration files for any SQL syntax issues.

**Last Updated:** 2025-12-05
