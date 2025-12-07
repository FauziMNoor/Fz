# 🚀 Quick Start: E-Book System

## ✅ Status: Implementation Complete!

E-Book system sudah **100% selesai diimplementasi**. Tinggal 2 langkah untuk mulai menggunakan:

---

## 📋 Step 1: Run Database Migration (5 menit)

### 1.1 Open Supabase SQL Editor

1. Buka browser, go to: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
2. Login dengan akun Supabase Anda
3. Click **"SQL Editor"** di sidebar kiri

### 1.2 Run Migration

1. Buka file: `supabase_migrations/create_ebooks_table.sql`
2. Copy **SEMUA** isinya (Ctrl+A, Ctrl+C)
3. Paste di SQL Editor
4. Click **"Run"** atau tekan **Ctrl+Enter**
5. Tunggu sampai selesai (~5-10 detik)

### 1.3 Verify Success

Run query ini untuk verify:

```sql
-- Check tables created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'ebook%';

-- Should return 3 tables:
-- ebooks
-- ebook_categories
-- ebook_downloads
```

Check categories:

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

### 1.4 Create Storage Bucket

1. Click **"Storage"** di sidebar
2. Click **"Create a new bucket"**
3. Name: `ebook-covers`
4. Public bucket: ✅ **YES** (check the box)
5. Click **"Create bucket"**

**Done!** ✅ Database ready!

---

## 📱 Step 2: Test The System (10 menit)

### 2.1 Start Development Server

Server sudah running di: **http://localhost:3032**

Jika belum running, jalankan:

```bash
npm run dev
```

### 2.2 Test Public Page

1. Buka browser: http://localhost:3032/ebook
2. Anda akan lihat halaman kosong dengan pesan "Tidak ada e-book ditemukan"
3. Ini normal karena belum ada e-book yang dibuat

### 2.3 Login to Dashboard

1. Go to: http://localhost:3032/auth/supabase/sign-in
2. Login dengan:
   - Email: `fauzimnoor90@gmail.com`
   - Password: `password123`

### 2.4 Create First E-Book

1. After login, go to: http://localhost:3032/dashboard/ebook
2. Click **"New E-Book"** button
3. Fill the form:

**Basic Information:**

- Judul E-Book: `Tauhid dalam Kehidupan Sehari-hari`
- Deskripsi: `Panduan praktis mengamalkan tauhid dalam kehidupan sehari-hari`
- Nama Penulis: `Fauzi M. Noor`
- Karya Sendiri: ✅ **Check this**

**Cover E-Book:**

- Upload cover image (atau skip dulu)

**File Information:**

- Google Drive URL: `https://drive.google.com/file/d/YOUR_FILE_ID/view`
  - Ganti `YOUR_FILE_ID` dengan ID file Google Drive Anda
  - Cara dapat: Upload PDF ke Google Drive → Right click → Get link → Copy
- Format File: `PDF`
- Ukuran File: `2.5 MB` (contoh)

**Kategori & Tags:**

- Kategori: `Tauhid & Aqidah`
- Tags: `tauhid`, `aqidah`, `islam` (tekan Enter setelah tiap tag)

**Settings:**

- Status: `Published`
- Featured E-Book: ✅ **Check this** (untuk tampil di featured section)

4. Click **"Create E-Book"**
5. Anda akan redirect ke list page

### 2.5 View E-Book

1. Go to public page: http://localhost:3032/ebook
2. Anda akan lihat e-book yang baru dibuat
3. Click **"View Details"**
4. Test download button (akan buka Google Drive)

### 2.6 Test Filters

1. Back to list page: http://localhost:3032/ebook
2. Test filter "Karya Fauzi M. Noor" button
3. Test category filter
4. Test search box
5. Test sort options

**Done!** ✅ System working!

---

## 🎯 What You Can Do Now

### Public Features (http://localhost:3032/ebook)

- ✅ Browse e-books dengan card layout
- ✅ Filter by kategori
- ✅ Filter "Karya Fauzi M. Noor"
- ✅ Search by title/author
- ✅ Sort by Latest/Popular/A-Z
- ✅ View e-book details
- ✅ Download e-book (Google Drive)
- ✅ View related e-books

### Dashboard Features (http://localhost:3032/dashboard/ebook)

- ✅ Create new e-book
- ✅ Edit e-book
- ✅ Delete e-book
- ✅ Upload cover image
- ✅ Manage categories & tags
- ✅ Set featured e-books
- ✅ Publish/Draft status
- ✅ View statistics

---

## 📚 How to Add Your E-Books

### Prepare Your E-Books

1. **Upload to Google Drive:**

   - Upload PDF/EPUB file ke Google Drive
   - Right click → Get link
   - Set to "Anyone with the link can view"
   - Copy the link

2. **Prepare Cover Image:**
   - Recommended size: 600x800px (ratio 3:4)
   - Format: JPG, PNG, WebP
   - Max size: 5MB

### Add E-Book via Dashboard

1. Go to: http://localhost:3032/dashboard/ebook
2. Click "New E-Book"
3. Fill form:
   - Title, description, author
   - Upload cover image
   - Paste Google Drive URL
   - Select category
   - Add tags
   - Set as featured (optional)
   - Publish
4. Click "Create E-Book"

### Bulk Add E-Books (Optional)

Jika punya banyak e-book, bisa insert via SQL:

```sql
INSERT INTO ebooks (
  title, slug, description, cover_image_url,
  google_drive_url, file_size, file_format,
  author_name, is_own_work, category, tags,
  status, is_featured, published_at
) VALUES
  (
    'Judul E-Book',
    'judul-ebook',
    'Deskripsi singkat',
    'https://example.com/cover.jpg',
    'https://drive.google.com/file/d/xxxxx/view',
    '2.5 MB',
    'PDF',
    'Fauzi M. Noor',
    true,
    'tauhid-aqidah',
    ARRAY['tauhid', 'aqidah'],
    'published',
    true,
    NOW()
  );
```

---

## 🎨 Navigation Menu

### Main Menu (Public)

```
Home | Blog | E-Book | Tentang Saya
```

### Dashboard Menu

```
Content
├─ Posts
├─ Portfolio
├─ E-Books ⭐ NEW
│  ├─ All E-Books
│  └─ Create New
└─ Media Library
```

---

## 📊 Categories Available

1. **Tauhid & Aqidah** - E-book tentang tauhid dan aqidah Islam
2. **Fiqh** - E-book tentang fiqh dan hukum Islam
3. **Sirah Nabawiyah** - E-book tentang sejarah Nabi Muhammad SAW
4. **Pendidikan** - E-book tentang pendidikan dan pembelajaran
5. **Kepemimpinan** - E-book tentang kepemimpinan dan manajemen
6. **Pengembangan Diri** - E-book tentang pengembangan diri dan motivasi

---

## 🔧 Troubleshooting

### Issue: Tables not created

**Solution:** Re-run migration SQL, check for errors

### Issue: Cover image not uploading

**Solution:** Check storage bucket `ebook-covers` exists and is public

### Issue: Download button not working

**Solution:** Check Google Drive URL is correct and public

### Issue: E-book not showing in public page

**Solution:** Check status is "published", not "draft"

---

## 📚 Documentation

- **Full Guide:** `EBOOK_SYSTEM_GUIDE.md`
- **Implementation Summary:** `EBOOK_IMPLEMENTATION_COMPLETE.md`
- **Migration File:** `supabase_migrations/create_ebooks_table.sql`

---

## ✅ Checklist

- [ ] Run database migration
- [ ] Create storage bucket `ebook-covers`
- [ ] Test public page
- [ ] Login to dashboard
- [ ] Create first e-book
- [ ] Upload cover image
- [ ] Test download button
- [ ] Test filters & search
- [ ] Add more e-books

---

## 🎉 You're Ready!

System sudah siap digunakan! Mulai upload e-book Anda sekarang! 📚

**Questions?** Check documentation atau tanya saya! 😊

---

**Last Updated:** 2025-12-07
**Status:** ✅ Ready to Use
