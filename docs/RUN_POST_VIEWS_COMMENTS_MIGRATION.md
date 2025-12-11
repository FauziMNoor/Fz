# 🚀 Post Views & Comments Migration

## Apa yang Ditambahkan?

Migration ini menambahkan fitur:

1. **View Counter** - Menghitung berapa kali post dibaca
2. **Comment System** - Sistem komentar yang berfungsi untuk user dan guest
3. **Comment Moderation** - Komentar perlu disetujui sebelum tampil

---

## 📋 Langkah-Langkah

### 1. Buka Supabase Dashboard

- Login ke [https://supabase.com](https://supabase.com)
- Pilih project Anda

### 2. Jalankan Migration

1. Klik **SQL Editor** di sidebar kiri
2. Klik **New Query**
3. Copy seluruh isi file `supabase_migrations/add_post_views_and_comments.sql`
4. Paste ke SQL Editor
5. Klik **Run** atau tekan `Ctrl+Enter`

### 3. Verifikasi

Setelah migration berhasil, Anda akan melihat:

- ✅ Kolom `view_count` di tabel `posts`
- ✅ Tabel baru `post_comments`
- ✅ Function `increment_post_views()`
- ✅ Function `get_post_comments_with_users()`

---

## 🎯 Fitur yang Sekarang Berfungsi

### 1. View Counter

- Setiap kali user membuka post, view count otomatis bertambah
- Ditampilkan di hero section post detail

### 2. Comment System

- **User Login**: Bisa langsung komentar (nama dari profile)
- **Guest User**: Harus isi nama dan email
- **Moderation**: Semua komentar status "pending" dulu
- **Approval**: Admin perlu approve dari dashboard

### 3. Comment Display

- Hanya komentar yang sudah di-approve yang tampil
- Menampilkan nama dan avatar user
- Untuk guest, tampil nama yang diisi saat komentar

---

## 🔐 Security (RLS Policies)

### Read (SELECT)

- ✅ Semua orang bisa baca komentar yang sudah approved
- ✅ User bisa baca komentar sendiri (semua status)
- ✅ Post author bisa baca semua komentar di post mereka

### Write (INSERT)

- ✅ Semua orang bisa submit komentar (login atau guest)
- ✅ Otomatis status "pending"

### Update/Delete

- ✅ User bisa edit/hapus komentar sendiri
- ✅ Post author bisa manage semua komentar di post mereka

---

## 📊 Struktur Tabel `post_comments`

```sql
- id (UUID, Primary Key)
- post_id (UUID, Foreign Key ke posts)
- user_id (UUID, Foreign Key ke auth.users) - NULL untuk guest
- guest_name (TEXT) - Nama guest jika tidak login
- guest_email (TEXT) - Email guest jika tidak login
- message (TEXT) - Isi komentar
- status (TEXT) - 'pending', 'approved', 'rejected'
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

---

## 🎨 UI Changes

### Post List (`/post/`)

- ✅ Menampilkan nama penulis dengan icon pena di bawah judul

### Post Detail (`/post/[slug]`)

- ✅ View counter di hero section
- ✅ Share button berfungsi (7 platform)
- ✅ Comment form untuk user dan guest
- ✅ Comment list menampilkan komentar approved
- ✅ Real-time refresh setelah submit komentar

---

## 🔧 Troubleshooting

### Error: "relation post_comments does not exist"

- Pastikan migration sudah dijalankan
- Refresh browser

### Komentar tidak muncul

- Cek status komentar di database (harus 'approved')
- Approve komentar dari dashboard

### View count tidak bertambah

- Cek apakah function `increment_post_views` sudah dibuat
- Cek console browser untuk error

---

## 📝 Next Steps

Setelah migration berhasil:

1. Test submit komentar sebagai guest
2. Test submit komentar sebagai user login
3. Approve komentar dari dashboard
4. Cek view counter bertambah saat buka post

---

**Dibuat:** 11 Desember 2025
