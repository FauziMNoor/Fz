# Fix User Posts di Profile Dashboard

## Masalah

Error saat load posts di halaman `/dashboard/user/`:

```
getUserPosts error: {}
Failed to fetch posts
```

## Penyebab

Tabel `user_posts`, `post_likes`, dan `post_comments` belum dibuat di database Supabase.

## Solusi

### Langkah 1: Buat Tabel di Database

1. Buka Supabase Dashboard
2. Pergi ke **SQL Editor**
3. Jalankan file SQL: `supabase_migrations/create_user_posts_table.sql`
4. Klik **Run** untuk mengeksekusi

File ini akan membuat:

- Tabel `user_posts` - untuk menyimpan post user
- Tabel `post_likes` - untuk menyimpan likes pada post
- Tabel `post_comments` - untuk menyimpan comments pada post
- Indexes untuk performa
- RLS policies untuk security

### Langkah 2: Verifikasi Tabel

Setelah menjalankan SQL, verifikasi tabel sudah dibuat:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_posts', 'post_likes', 'post_comments')
ORDER BY table_name;
```

Hasilnya harus menampilkan 3 tabel:

- post_comments
- post_likes
- user_posts

### Langkah 3: Test di Browser

1. Refresh halaman `/dashboard/user/`
2. Error seharusnya sudah hilang
3. Coba tulis post di input box
4. Klik tombol "Post"
5. Post akan tersimpan dan muncul di list

## Struktur Tabel

### user_posts

- `id` - UUID primary key
- `user_id` - UUID reference ke auth.users
- `message` - TEXT post content
- `media_urls` - TEXT[] array untuk gambar/video URLs
- `created_at` - timestamp
- `updated_at` - timestamp

### post_likes

- `id` - UUID primary key
- `post_id` - UUID reference ke user_posts
- `user_id` - UUID reference ke auth.users
- `created_at` - timestamp
- UNIQUE constraint pada (post_id, user_id)

### post_comments

- `id` - UUID primary key
- `post_id` - UUID reference ke user_posts
- `user_id` - UUID reference ke auth.users
- `message` - TEXT comment content
- `created_at` - timestamp
- `updated_at` - timestamp

## Fitur yang Sudah Diimplementasi

### Input Post

- Input textarea untuk menulis post
- Button untuk attach image/video (UI only, upload belum diimplementasi)
- Button "Post" dengan loading state
- Validasi: tidak bisa post jika kosong
- Auto-refresh list setelah create post

### Display Posts

- Menampilkan posts dari database
- Diurutkan dari yang terbaru
- Menggunakan komponen `ProfilePostItem`

### Security (RLS)

- User bisa melihat semua posts
- User hanya bisa create/update/delete post mereka sendiri
- User bisa like/unlike post
- User bisa comment pada post

## File yang Terlibat

- `src/sections/user/profile-home.jsx` - Komponen input dan display posts
- `src/sections/user/view/user-profile-view.jsx` - Parent component, fetch posts
- `src/lib/supabase-client.js` - Fungsi database operations
- `supabase_migrations/create_user_posts_table.sql` - SQL untuk create tables

## Troubleshooting

### Error masih muncul setelah create table

1. Pastikan SQL sudah dijalankan dengan sukses
2. Cek apakah ada error di SQL Editor
3. Refresh browser dengan hard reload (Ctrl+Shift+R)

### Post tidak tersimpan

1. Cek console browser untuk error detail
2. Pastikan user sudah login
3. Cek RLS policies sudah benar
4. Pastikan `auth.uid()` return user ID yang valid

### Posts tidak muncul

1. Cek apakah ada data di tabel:
   ```sql
   SELECT * FROM user_posts ORDER BY created_at DESC;
   ```
2. Cek RLS policy untuk SELECT
3. Refresh halaman
