# 🔧 Integrasi Account Settings dengan Supabase Database

## 📋 Ringkasan Perubahan

Account settings page (`/dashboard/user/account`) sekarang **terintegrasi penuh dengan Supabase database**. Data yang Anda edit akan tersimpan ke database dan akan muncul kembali saat Anda reload halaman.

---

## ⚠️ PENTING: Setup Database & Storage

Sebelum menggunakan fitur account settings, Anda **HARUS**:

1. Menjalankan SQL migration untuk menambahkan kolom-kolom baru ke tabel `profiles`
2. Membuat storage buckets untuk upload avatar

### Langkah A: Database Migration

1. **Buka Supabase Dashboard**

   - URL: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc

2. **Buka SQL Editor**

   - Klik menu **"SQL Editor"** di sidebar kiri
   - Klik **"New query"**

3. **Copy & Paste SQL Migration**

   Buka file `supabase_migrations/add_profile_fields.sql` dan copy semua isinya, lalu paste ke SQL Editor.

   Atau copy SQL berikut:

   ```sql
   -- Add additional fields to profiles table for user account settings
   ALTER TABLE profiles
   ADD COLUMN IF NOT EXISTS phone_number TEXT,
   ADD COLUMN IF NOT EXISTS country TEXT,
   ADD COLUMN IF NOT EXISTS address TEXT,
   ADD COLUMN IF NOT EXISTS state TEXT,
   ADD COLUMN IF NOT EXISTS city TEXT,
   ADD COLUMN IF NOT EXISTS zip_code TEXT,
   ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

   -- Add comment to document the changes
   COMMENT ON COLUMN profiles.phone_number IS 'User phone number';
   COMMENT ON COLUMN profiles.country IS 'User country';
   COMMENT ON COLUMN profiles.address IS 'User street address';
   COMMENT ON COLUMN profiles.state IS 'User state/region';
   COMMENT ON COLUMN profiles.city IS 'User city';
   COMMENT ON COLUMN profiles.zip_code IS 'User zip/postal code';
   COMMENT ON COLUMN profiles.is_public IS 'Whether the profile is public or private';
   ```

4. **Jalankan Query**

   - Klik tombol **"Run"** atau tekan `Ctrl+Enter`
   - Tunggu sampai muncul pesan **"Success. No rows returned"**

5. **Verifikasi**
   - Klik menu **"Table Editor"** di sidebar
   - Pilih tabel **"profiles"**
   - Pastikan kolom-kolom baru sudah muncul:
     - `phone_number`
     - `country`
     - `address`
     - `state`
     - `city`
     - `zip_code`
     - `is_public`

### Langkah B: Setup Storage Buckets

**WAJIB untuk upload avatar!**

1. **Buka Supabase Dashboard → Storage**

   - URL: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/storage/buckets

2. **Buat Bucket "avatars"**

   - Klik **"New bucket"**
   - Bucket name: `avatars`
   - Public bucket: **✅ CENTANG**
   - Klik **"Create bucket"**

3. **Buat Bucket "post-images"** (untuk blog images)
   - Klik **"New bucket"**
   - Bucket name: `post-images`
   - Public bucket: **✅ CENTANG**
   - Klik **"Create bucket"**

**Dokumentasi lengkap:** Lihat file `SUPABASE_STORAGE_SETUP.md`

---

## ✅ Fitur yang Sudah Diimplementasikan

### 1. **Load Data dari Database**

- Saat membuka halaman account settings, data akan diambil dari tabel `profiles` di Supabase
- Menggunakan fungsi `getUserProfile(userId)` dari `src/lib/supabase-client.js`

### 2. **Upload Avatar ke Supabase Storage**

- Saat user pilih foto baru, akan otomatis upload ke Supabase Storage bucket `avatars`
- Menggunakan fungsi `uploadAvatar(userId, file)` dari `src/lib/supabase-client.js`
- Avatar disimpan di path: `avatars/{userId}/avatar.{ext}`
- Public URL disimpan ke kolom `avatar_url` di database
- Menampilkan toast notification "Avatar uploaded successfully!"

### 3. **Save Data ke Database**

- Saat klik tombol "Save changes", data akan disimpan ke database
- Menggunakan fungsi `updateUserProfile(userId, profileData)` dari `src/lib/supabase-client.js`
- Menampilkan toast notification "Profile updated successfully!" jika berhasil

### 4. **Field Mapping**

| Form Field     | Database Column |
| -------------- | --------------- |
| Name           | `full_name`     |
| Email          | `email`         |
| Avatar         | `avatar_url`    |
| Phone number   | `phone_number`  |
| Country        | `country`       |
| Address        | `address`       |
| State/region   | `state`         |
| City           | `city`          |
| Zip/code       | `zip_code`      |
| About          | `bio`           |
| Public profile | `is_public`     |

---

## 📁 File yang Diubah

### 1. **src/lib/supabase-client.js**

- ✅ Menambahkan fungsi `getUserProfile(userId)` - Get user profile by ID
- ✅ Menambahkan fungsi `updateUserProfile(userId, profileData)` - Update user profile
  - ✅ Menambahkan fungsi `uploadAvatar(userId, file)` - Upload avatar to storage
  - ✅ Menambahkan fungsi `deleteAvatar(userId)` - Delete avatar from storage
  - ✅ Menambahkan fungsi `uploadPostImage(postId, file)` - Upload post image to storage

### 2. **src/sections/account/account-general.jsx**

- ❌ Menghapus `useMockedUser()` - tidak lagi menggunakan mock data
- ✅ Menggunakan `useAuthContext()` - mengambil user yang sedang login
- ✅ Menambahkan `useEffect` untuk fetch profile dari database saat component mount
- ✅ Mengupdate `onSubmit` untuk:
  - Upload avatar ke Supabase Storage jika user pilih foto baru
  - Menyimpan data ke database menggunakan `updateUserProfile()`
- ✅ Menambahkan loading state saat fetch data
- ✅ Menambahkan error handling dengan toast notification

---

## 🧪 Cara Testing

1. **Login ke aplikasi**

   - Email: `fauzimnoor90@gmail.com`
   - Password: `password123`

2. **Buka Account Settings**

   - URL: http://localhost:3032/dashboard/user/account

3. **Edit Data**

   - Ubah nama, phone number, address, dll
   - Klik tombol **"Save changes"**
   - Pastikan muncul toast **"Profile updated successfully!"**

4. **Reload Halaman**

   - Tekan `F5` atau refresh browser
   - Pastikan data yang baru saja Anda edit **masih ada** (tidak kembali ke data lama)

5. **Cek Database**
   - Buka Supabase Dashboard → Table Editor → profiles
   - Cari row dengan email `fauzimnoor90@gmail.com`
   - Pastikan data sudah terupdate

---

## 🔍 Troubleshooting

### Error: "column does not exist"

**Penyebab:** Migration belum dijalankan
**Solusi:** Jalankan SQL migration di atas

### Error: "Failed to load profile data"

**Penyebab:** User belum punya row di tabel profiles
**Solusi:** Pastikan trigger `create_profile_on_signup` sudah berjalan saat user register

### Data tidak tersimpan

**Penyebab:** RLS policy mungkin memblokir update
**Solusi:** Cek RLS policy di Supabase, pastikan user bisa update profile sendiri

---

## 📝 Next Steps (Opsional)

- [ ] Upload avatar ke Supabase Storage
- [ ] Validasi phone number format
- [ ] Auto-save draft (debounced)
- [ ] Show unsaved changes warning
- [ ] Add profile completion percentage

---

**Last Updated:** 2025-12-03
**Author:** Fauzi M. Noor
