## Fix Comments dan Implementasi Notifikasi

Masalah yang perlu diperbaiki:

1. Error saat add comment
2. Belum ada notifikasi untuk admin saat ada komentar baru

### Langkah 1: Fix RLS Policy untuk Comments

Jalankan SQL ini di Supabase SQL Editor:

```
supabase_migrations/fix_post_comments_rls.sql
```

File ini akan:

- Drop policy lama yang mungkin salah
- Buat policy baru yang benar
- Allow authenticated users untuk create comments
- Allow semua orang untuk view comments

### Langkah 2: Buat Tabel Notifications

Jalankan SQL ini di Supabase SQL Editor:

```
supabase_migrations/create_notifications_table.sql
```

File ini akan:

- Buat tabel `notifications`
- Buat trigger otomatis untuk create notification saat ada comment baru
- Setup RLS policies untuk notifications

### Langkah 3: Test Comments

1. Refresh browser
2. Buka halaman `/tentang-saya` atau `/dashboard/user/`
3. Coba tulis komentar di post
4. Klik icon send atau tekan Enter
5. Komentar seharusnya berhasil tersimpan

### Langkah 4: Cek Notifications

Setelah ada yang komentar di post Anda:

1. Buka Supabase Dashboard
2. Pergi ke **Table Editor** → **notifications**
3. Lihat notifikasi yang ter-create otomatis

Struktur notifikasi:

- `type`: 'comment'
- `title`: 'New Comment'
- `message`: '[Nama] commented on your post'
- `link`: '/dashboard/user'
- `is_read`: false
- `created_by`: ID user yang komentar

### Cara Kerja Notifikasi

1. **User A** komentar di post **User B**
2. **Trigger** otomatis jalan
3. **Notification** dibuat untuk **User B**
4. **User B** bisa lihat notifikasi di dashboard (UI belum dibuat)

### Next Steps (Opsional)

Untuk menampilkan notifikasi di UI dashboard:

1. Buat komponen NotificationBell di header
2. Fetch notifications dari database
3. Tampilkan badge dengan jumlah unread
4. Klik untuk lihat list notifications
5. Mark as read saat diklik

Ini bisa diimplementasikan nanti jika diperlukan.

### Troubleshooting

**Error masih muncul saat comment:**

1. Pastikan SQL sudah dijalankan
2. Cek console browser untuk error detail
3. Pastikan user sudah login
4. Cek RLS policies di Supabase

**Notification tidak muncul:**

1. Cek tabel notifications di Supabase
2. Pastikan trigger sudah dibuat
3. Coba comment lagi
4. Refresh table notifications
