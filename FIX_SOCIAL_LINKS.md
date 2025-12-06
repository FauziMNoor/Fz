# Fix Social Links di Profile Dashboard

## Masalah

Bagian "Social" di halaman `/dashboard/user/` masih menampilkan data static meskipun sudah mengisi data di Account Settings.

## Penyebab

Kolom social media di database mungkin belum sesuai dengan yang digunakan di kode. Kode menggunakan:

- `social_facebook`
- `social_instagram`
- `social_threads`
- `social_youtube`

Tapi database mungkin masih menggunakan kolom lama:

- `social_linkedin`
- `social_twitter`

## Solusi

### Langkah 1: Update Database Schema

1. Buka Supabase Dashboard
2. Pergi ke **SQL Editor**
3. Jalankan file SQL: `supabase_migrations/fix_social_columns.sql`
4. Klik **Run** untuk mengeksekusi

File ini akan:

- Menambahkan kolom `social_threads` dan `social_youtube` jika belum ada
- Menghapus kolom `social_linkedin` dan `social_twitter` (opsional)
- Memastikan kolom `social_facebook` dan `social_instagram` ada

### Langkah 2: Verifikasi Data

Setelah menjalankan SQL, cek apakah kolom sudah benar:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name LIKE 'social_%'
ORDER BY column_name;
```

Hasilnya harus menampilkan:

- social_facebook
- social_instagram
- social_threads
- social_youtube

### Langkah 3: Test di Browser

1. Buka halaman Account Settings: `http://localhost:3032/dashboard/account`
2. Pergi ke tab **Social Links**
3. Isi data social media Anda (contoh):
   - Facebook: `https://facebook.com/username`
   - Instagram: `https://instagram.com/username`
   - Threads: `https://threads.net/@username`
   - YouTube: `https://youtube.com/@username`
4. Klik **Save Changes**
5. Buka halaman Profile: `http://localhost:3032/dashboard/user/`
6. Cek bagian "Social" di sebelah kanan - seharusnya sudah menampilkan data yang benar

## Cara Kerja

1. **getUserProfile()** mengambil semua data dari tabel `profiles` termasuk kolom social
2. **user-profile-view.jsx** memetakan data ke format yang dibutuhkan:
   ```javascript
   socialLinks: {
     facebook: profile?.social_facebook || '',
     instagram: profile?.social_instagram || '',
     threads: profile?.social_threads || '',
     youtube: profile?.social_youtube || '',
   }
   ```
3. **profile-home.jsx** menampilkan social links yang ada (hanya yang terisi)

## Troubleshooting

### Social links masih tidak muncul

1. Cek console browser (F12) untuk error
2. Pastikan data sudah tersimpan di database:
   ```sql
   SELECT id, full_name, social_facebook, social_instagram, social_threads, social_youtube
   FROM profiles
   WHERE id = 'YOUR_USER_ID';
   ```
3. Refresh halaman dengan hard reload (Ctrl+Shift+R)

### Data tidak tersimpan saat Save

1. Cek console untuk error dari `updateSocialLinks()`
2. Pastikan RLS (Row Level Security) policy sudah benar untuk tabel profiles
3. Pastikan user sudah login dan memiliki permission untuk update

## File yang Terlibat

- `src/sections/user/view/user-profile-view.jsx` - Mengambil data profile
- `src/sections/user/profile-home.jsx` - Menampilkan social links
- `src/lib/supabase-client.js` - Fungsi `getUserProfile()` dan `updateSocialLinks()`
- `supabase_migrations/fix_social_columns.sql` - SQL untuk fix kolom database
