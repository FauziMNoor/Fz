# Panduan Sistem Moderasi Komentar

## Fitur yang Diimplementasikan

### 1. Status Komentar

Setiap komentar memiliki 3 status:

- **Pending** (⏳) - Komentar baru, menunggu approval admin
- **Approved** (✅) - Komentar disetujui, tampil di public
- **Rejected** (❌) - Komentar ditolak, tidak tampil di public

### 2. Notifikasi untuk Admin

Ketika ada komentar baru:

- Notifikasi otomatis dibuat di database
- Title: "New Comment (Pending Approval)"
- Message: "[Nama] commented on your post. Click to approve or reject."
- Link ke post yang dikomentar

### 3. Moderasi di Dashboard

Admin (pemilik post) bisa:

- Lihat semua komentar termasuk yang pending
- Approve komentar → tampil di public
- Reject komentar → hide dari public
- Badge "PENDING" atau "REJECTED" untuk identifikasi

### 4. Tampilan Public

Pengunjung hanya bisa lihat:

- Komentar dengan status "approved"
- Komentar pending/rejected tidak tampil

## Setup Database

### Langkah 1: Jalankan SQL Migration

Buka Supabase SQL Editor dan jalankan:

```
supabase_migrations/add_comment_moderation.sql
```

File ini akan:

- Tambah kolom `status` ke tabel `post_comments`
- Update RLS policy untuk filter berdasarkan status
- Update trigger notifikasi
- Set existing comments ke "approved"

### Langkah 2: Verifikasi

Cek di Supabase Table Editor → `post_comments`:

- Kolom `status` sudah ada
- Default value: 'pending'
- Check constraint: ('pending', 'approved', 'rejected')

## Cara Kerja

### Skenario 1: Pengunjung Berkomentar

1. Pengunjung tulis komentar di post Anda
2. Komentar tersimpan dengan status "pending"
3. Notifikasi dibuat untuk Anda
4. Komentar **TIDAK** tampil di public

### Skenario 2: Admin Moderasi

1. Anda (admin) buka dashboard
2. Lihat post dengan komentar pending (badge kuning "PENDING")
3. Baca komentar
4. Klik **Approve** → komentar tampil di public
5. Atau klik **Reject** → komentar tetap hidden

### Skenario 3: Komentar Sendiri

1. Anda komentar di post sendiri
2. Status otomatis "approved" (tidak perlu moderasi)
3. Langsung tampil di public

## UI/UX

### Badge Status

- 🟡 **PENDING** - Background kuning, menunggu approval
- 🔴 **REJECTED** - Background merah, ditolak

### Tombol Moderasi

Hanya muncul untuk:

- Pemilik post (admin)
- Komentar dengan status "pending"

Tombol:

- ✅ **Approve** (hijau) - Setujui komentar
- ❌ **Reject** (merah) - Tolak komentar

### Warna Background

- Pending: Kuning muda (warning.lighter)
- Rejected: Merah muda (error.lighter)
- Approved: Abu-abu (background.neutral)

## Testing

### Test 1: Komentar Baru

1. Logout atau buka incognito
2. Buka `/tentang-saya`
3. Login sebagai user lain
4. Tulis komentar
5. Komentar tidak tampil di public
6. Login sebagai admin
7. Lihat komentar dengan badge "PENDING"

### Test 2: Approve Komentar

1. Klik tombol "Approve" di komentar pending
2. Badge hilang
3. Background berubah jadi abu-abu
4. Refresh halaman public
5. Komentar sekarang tampil

### Test 3: Reject Komentar

1. Klik tombol "Reject" di komentar pending
2. Confirm dialog muncul
3. Badge berubah jadi "REJECTED"
4. Background merah muda
5. Komentar tetap tidak tampil di public

## Keamanan

### RLS Policy

```sql
-- Hanya tampilkan komentar yang:
-- 1. Status = approved (untuk semua orang)
-- 2. Komentar sendiri (untuk commenter)
-- 3. Semua komentar di post sendiri (untuk post owner)
```

### Benefit

- ✅ Cegah spam
- ✅ Cegah komentar tidak pantas
- ✅ Kontrol penuh untuk admin
- ✅ Pengunjung hanya lihat komentar yang disetujui

## Notifikasi (Database)

Notifikasi tersimpan di tabel `notifications`:

```sql
SELECT * FROM notifications
WHERE type = 'comment'
ORDER BY created_at DESC;
```

Struktur:

- `user_id`: ID admin (pemilik post)
- `type`: 'comment'
- `title`: 'New Comment (Pending Approval)'
- `message`: '[Nama] commented...'
- `link`: Link ke post
- `is_read`: false (belum dibaca)
- `created_by`: ID commenter

## Next Steps (Opsional)

### 1. Notification Bell UI

Buat komponen di header untuk:

- Tampilkan jumlah notifikasi unread
- List notifikasi saat diklik
- Mark as read
- Link ke post yang dikomentar

### 2. Bulk Actions

Tambah fitur:

- Approve all pending comments
- Delete all rejected comments
- Filter comments by status

### 3. Email Notification

Kirim email ke admin saat ada komentar baru

### 4. Auto-Approve

Setting untuk auto-approve komentar dari:

- User yang sudah pernah approved
- User dengan reputation tinggi
