# 🚀 QUICK START - Blog Database Setup

## ⚡ 3 Langkah Mudah

### Step 1: Buka Supabase SQL Editor

1. Buka browser, pergi ke:

   ```
   https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor
   ```

2. Klik **"SQL Editor"** di sidebar kiri

3. Klik **"New query"**

---

### Step 2: Run Migration

1. **Buka file ini di VS Code:**

   ```
   supabase_migrations/create_posts_table_simple.sql
   ```

   ⚠️ **PENTING:** Gunakan file `create_posts_table_simple.sql` (yang sudah diperbaiki!)

2. **Copy semua isi file** (Ctrl+A, Ctrl+C)

3. **Paste ke SQL Editor** di Supabase (Ctrl+V)

4. **Klik tombol "Run"** atau tekan `Ctrl+Enter`

5. **Tunggu sampai selesai** (sekitar 2-3 detik)

6. **Lihat hasil:**
   - Jika sukses: ✅ "Success. No rows returned"
   - Jika error: ❌ Lihat error message

---

### Step 3: Verify

**Run query ini untuk cek:**

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT 1
  FROM information_schema.tables
  WHERE table_name = 'posts'
) as posts_table_exists;
```

**Expected result:**

```
posts_table_exists: true
```

**Check categories:**

```sql
SELECT * FROM categories;
```

**Expected result:** 6 rows (Pendidikan, Agile, Kepemimpinan, Pesantren, Teknologi, Inspirasi)

---

## ✅ Done! Sekarang Test

### Test Create Post:

1. **Start dev server:**

   ```bash
   npm run dev
   ```

2. **Login:**

   ```
   http://localhost:3032/auth/supabase/sign-in
   Email: fauzimnoor90@gmail.com
   Password: password123
   ```

3. **Create Post:**

   ```
   http://localhost:3032/dashboard/post/new
   ```

4. **Fill form:**

   - Title: "Artikel Test Pertama"
   - Description: "Ini adalah artikel test untuk coba fitur baru"
   - Content: (tulis minimal 100 karakter)
   - Cover: Upload gambar
   - Tags: ["test", "artikel"]
   - Meta keywords: ["test"]
   - Publish: ON (toggle)

5. **Click "Create post"**

6. **Should see:**
   - ✅ Toast: "Artikel berhasil dibuat!"
   - ✅ Redirect ke `/dashboard/post`
   - ✅ Post muncul di list

---

## 🎉 Success!

Sekarang kamu bisa:

- ✅ Buat artikel baru
- ✅ Upload gambar di artikel (drag & drop)
- ✅ Embed video YouTube/Vimeo
- ✅ Edit artikel
- ✅ Filter by status (Draft/Published)
- ✅ Sort by date/popularity

---

## 🐛 Troubleshooting

### Error: "relation 'posts' does not exist"

**Solusi:** Migration belum di-run. Ulangi Step 2.

### Error: "Failed to upload image"

**Check:**

- File size < 5MB
- File type adalah gambar (JPG, PNG, GIF)
- Bucket `post-images` sudah ada

### Post tidak muncul di list

**Check:**

- Sudah login?
- Post status = published?
- Refresh page (F5)

---

## 📚 Dokumentasi Lengkap

Lihat file ini untuk detail teknis:

- `BLOG_DATABASE_INTEGRATION.md` - Complete technical guide
- `EDITOR_IMAGE_VIDEO_GUIDE.md` - Editor features guide

---

**Need help?** Check console for errors (F12 → Console tab)
