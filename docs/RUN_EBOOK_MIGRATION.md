# 🚀 Quick Start: E-Book System Migration

## ⚡ Langkah Cepat (5 Menit)

### Step 1: Run Database Migration

1. **Buka Supabase Dashboard**

   - Go to: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
   - Click "SQL Editor" di sidebar

2. **Copy Migration SQL**

   - Buka file: `supabase_migrations/create_ebooks_table.sql`
   - Copy semua isinya (Ctrl+A, Ctrl+C)

3. **Run Migration**

   - Paste di SQL Editor
   - Click "Run" atau tekan Ctrl+Enter
   - Tunggu sampai selesai (sekitar 5-10 detik)

4. **Verify Success**

   ```sql
   -- Check tables created
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public' AND table_name LIKE 'ebook%';

   -- Should return:
   -- ebooks
   -- ebook_categories
   -- ebook_downloads
   ```

5. **Check Default Categories**

   ```sql
   SELECT * FROM ebook_categories ORDER BY display_order;

   -- Should return 6 categories:
   -- 1. Tauhid & Aqidah
   -- 2. Fiqh
   -- 3. Sirah Nabawiyah
   -- 4. Pendidikan
   -- 5. Kepemimpinan
   -- 6. Pengembangan Diri
   ```

### Step 2: Create Storage Bucket

1. **Go to Storage**

   - Click "Storage" di sidebar
   - Click "Create a new bucket"

2. **Create Bucket**

   - Name: `ebook-covers`
   - Public bucket: ✅ YES
   - Click "Create bucket"

3. **Set Policies**
   - Click bucket `ebook-covers`
   - Go to "Policies" tab
   - Click "New Policy"
   - Copy paste policies dari `EBOOK_SYSTEM_GUIDE.md` section "Step 2"
   - Atau biarkan default (public read, authenticated write)

### Step 3: Test Helper Functions

1. **Open Browser Console**

   - Go to: http://localhost:3032
   - Press F12 (Developer Tools)
   - Go to Console tab

2. **Test Functions**

   ```javascript
   // Import functions (if using module)
   import { getEbookCategories } from './src/lib/supabase-client.js';

   // Test get categories
   const categories = await getEbookCategories();
   console.log('Categories:', categories);

   // Should return 6 categories
   ```

---

## ✅ Verification Checklist

- [ ] Tables created (ebooks, ebook_categories, ebook_downloads)
- [ ] 6 default categories inserted
- [ ] Indexes created
- [ ] Triggers active
- [ ] RLS policies enabled
- [ ] Storage bucket `ebook-covers` created
- [ ] Helper functions working

---

## 🎯 What's Next?

Setelah migration berhasil, kita bisa lanjut ke:

1. **Create UI Components** (Priority 1)

   - E-book card component
   - E-book list view
   - E-book detail page
   - E-book form (dashboard)

2. **Update Navigation** (Priority 1)

   - Add "E-Book" menu di header
   - Add "E-Books" menu di dashboard sidebar

3. **Add Sample Data** (Optional)
   - Insert beberapa e-book sample untuk testing
   - Upload cover images

---

## 🐛 Troubleshooting

### Error: "relation already exists"

**Cause:** Tables sudah ada dari migration sebelumnya
**Solution:**

```sql
-- Drop existing tables (HATI-HATI: akan hapus data!)
DROP TABLE IF EXISTS ebook_downloads CASCADE;
DROP TABLE IF EXISTS ebook_categories CASCADE;
DROP TABLE IF EXISTS ebooks CASCADE;

-- Then run migration again
```

### Error: "permission denied"

**Cause:** RLS policies blocking
**Solution:** Check if you're logged in as admin user

### Error: "bucket already exists"

**Cause:** Bucket sudah dibuat sebelumnya
**Solution:** Skip step 2, bucket sudah ready

---

## 📊 Sample Data (Optional)

Jika mau insert sample e-book untuk testing:

```sql
INSERT INTO ebooks (
  title, slug, description,
  google_drive_url, file_size, file_format,
  author_name, is_own_work, category, tags,
  status, is_featured, published_at
) VALUES
  (
    'Tauhid dalam Kehidupan Sehari-hari',
    'tauhid-dalam-kehidupan-sehari-hari',
    'Panduan praktis mengamalkan tauhid dalam kehidupan sehari-hari dengan pendekatan yang mudah dipahami.',
    'https://drive.google.com/file/d/1234567890/view',
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
    'https://drive.google.com/file/d/0987654321/view',
    '3.2 MB',
    'PDF',
    'Fauzi M. Noor',
    true,
    'fiqh',
    ARRAY['fiqh', 'ibadah', 'praktis'],
    'published',
    true,
    NOW()
  );
```

---

## 📚 Documentation

- **Full Guide:** `EBOOK_SYSTEM_GUIDE.md`
- **Migration File:** `supabase_migrations/create_ebooks_table.sql`
- **Helper Functions:** `src/lib/supabase-client.js`

---

**Ready to implement UI?** Let me know! 🚀
