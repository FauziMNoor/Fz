# 📦 Setup Supabase Storage untuk Avatar & Images

## 📋 Ringkasan

Dokumen ini menjelaskan cara setup Supabase Storage untuk menyimpan:
- **Avatar** - Foto profil user
- **Post Images** - Gambar untuk blog posts

---

## ⚠️ PENTING: Buat Storage Buckets

Sebelum bisa upload avatar, Anda **HARUS** membuat storage buckets di Supabase Dashboard.

### Langkah 1: Buat Bucket "avatars"

1. **Buka Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc

2. **Buka Storage**
   - Klik menu **"Storage"** di sidebar kiri

3. **Create New Bucket**
   - Klik tombol **"New bucket"**
   - Bucket name: `avatars`
   - Public bucket: **✅ CENTANG** (agar avatar bisa diakses publik)
   - Klik **"Create bucket"**

### Langkah 2: Buat Bucket "post-images"

1. **Create New Bucket**
   - Klik tombol **"New bucket"** lagi
   - Bucket name: `post-images`
   - Public bucket: **✅ CENTANG** (agar gambar blog bisa diakses publik)
   - Klik **"Create bucket"**

### Langkah 3: Setup Storage Policies (Opsional)

Jika Anda ingin kontrol akses yang lebih ketat, jalankan SQL berikut di **SQL Editor**:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to avatars
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Note:** Jika bucket sudah di-set sebagai **Public**, policy di atas tidak wajib. Tapi untuk keamanan lebih baik, sebaiknya dijalankan.

---

## ✅ Fitur yang Sudah Diimplementasikan

### 1. **Helper Functions di `src/lib/supabase-client.js`**

```javascript
// Upload avatar
const avatarUrl = await uploadAvatar(userId, fileObject);

// Delete avatar
await deleteAvatar(userId);

// Upload post image
const imageUrl = await uploadPostImage(postId, fileObject);
```

### 2. **Upload Avatar di Account Settings**

File: `src/sections/account/account-general.jsx`

- ✅ Saat user pilih foto baru, akan otomatis upload ke Supabase Storage
- ✅ Avatar disimpan di path: `avatars/{userId}/avatar.{ext}`
- ✅ Menggunakan `upsert: true` - replace avatar lama dengan yang baru
- ✅ Public URL disimpan ke kolom `avatar_url` di tabel `profiles`
- ✅ Menampilkan toast notification saat upload

### 3. **Struktur Folder di Storage**

```
avatars/
  ├── {user-id-1}/
  │   └── avatar.jpg
  ├── {user-id-2}/
  │   └── avatar.png
  └── ...

post-images/
  ├── {post-id-1}/
  │   ├── 1234567890.jpg
  │   └── 1234567891.png
  ├── {post-id-2}/
  │   └── 1234567892.jpg
  └── ...
```

---

## 🧪 Cara Testing Upload Avatar

1. **Pastikan buckets sudah dibuat** (langkah 1 & 2 di atas)

2. **Login ke aplikasi**
   - Email: `fauzimnoor90@gmail.com`
   - Password: `password123`

3. **Buka Account Settings**
   - URL: http://localhost:3032/dashboard/user/account

4. **Upload Avatar**
   - Klik area upload avatar
   - Pilih file gambar (jpg, png, gif)
   - Pastikan ukuran < 3MB
   - Klik **"Save changes"**

5. **Verifikasi Upload**
   - Pastikan muncul toast **"Avatar uploaded successfully!"**
   - Pastikan muncul toast **"Profile updated successfully!"**
   - Reload halaman - avatar baru harus muncul

6. **Cek di Supabase Storage**
   - Buka Supabase Dashboard → Storage → avatars
   - Cari folder dengan nama user ID Anda
   - Pastikan file `avatar.jpg` (atau .png) ada di sana

7. **Cek di Database**
   - Buka Table Editor → profiles
   - Cari row dengan email `fauzimnoor90@gmail.com`
   - Kolom `avatar_url` harus berisi URL public dari Supabase Storage
   - Format: `https://nvppnowugnjfvquvibqc.supabase.co/storage/v1/object/public/avatars/{userId}/avatar.jpg`

---

## 🔍 Troubleshooting

### Error: "Bucket not found"
**Penyebab:** Bucket belum dibuat  
**Solusi:** Buat bucket `avatars` di Supabase Dashboard → Storage

### Error: "new row violates row-level security policy"
**Penyebab:** RLS policy terlalu ketat  
**Solusi:** 
- Set bucket sebagai **Public** di dashboard, atau
- Jalankan SQL policy di atas untuk allow upload

### Avatar tidak muncul setelah upload
**Penyebab:** Bucket tidak public  
**Solusi:** 
- Buka Storage → avatars → Settings
- Centang **"Public bucket"**
- Klik **"Save"**

### Error: "File size too large"
**Penyebab:** File > 3MB  
**Solusi:** Compress gambar atau pilih file yang lebih kecil

---

## 📝 Next Steps (Opsional)

- [ ] Image compression sebelum upload
- [ ] Crop avatar menjadi square
- [ ] Preview avatar sebelum save
- [ ] Progress bar saat upload
- [ ] Hapus avatar lama dari storage saat upload baru
- [ ] Validasi file type (hanya jpg, png, gif)

---

## 🔗 Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Upload Files](https://supabase.com/docs/guides/storage/uploads)

---

**Last Updated:** 2025-12-03  
**Author:** Fauzi M. Noor

