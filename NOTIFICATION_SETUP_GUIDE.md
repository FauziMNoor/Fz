# Panduan Setup Notifikasi - Step by Step

## Langkah 1: Diagnosa Kondisi Saat Ini

Jalankan SQL ini untuk melihat kondisi database:

```
supabase_migrations/diagnose_all_tables.sql
```

Catat hasil dari setiap query, terutama:

- ✅ Apakah tabel `notifications` ada?
- ✅ Apakah kolom `status` ada di `post_comments`?
- ✅ Apakah trigger `trigger_notify_post_owner` ada?
- ✅ Apakah function `notify_post_owner` ada?
- ✅ Apakah RLS policies untuk `notifications` ada?

## Langkah 2: Setup Lengkap

Jalankan SQL ini untuk setup complete:

```
supabase_migrations/complete_notification_setup.sql
```

SQL ini akan:

1. ✅ Create tabel `notifications` (jika belum ada)
2. ✅ Add kolom `status` ke `post_comments` (jika belum ada)
3. ✅ Setup RLS policies yang benar
4. ✅ Create trigger function dengan error handling
5. ✅ Create trigger untuk auto-notify
6. ✅ Grant permissions yang diperlukan
7. ✅ Verify semua sudah benar

## Langkah 3: Test Manual

### Test 1: Insert Notification Manual

```sql
-- Insert test notification
INSERT INTO notifications (user_id, type, title, message, link, is_read)
VALUES (
  'bb2e61da-8f0c-4f12-9fef-59f82db50d69',  -- Your user ID
  'comment',
  'Test Notification',
  'This is a test notification',
  '/dashboard/user',
  false
);

-- Verify
SELECT * FROM notifications
WHERE user_id = 'bb2e61da-8f0c-4f12-9fef-59f82db50d69'
ORDER BY created_at DESC;
```

**Expected:** Notification berhasil insert dan muncul di query result

### Test 2: Test Trigger

```sql
-- Get a real post ID first
SELECT id as post_id, user_id as owner_id
FROM user_posts
LIMIT 1;

-- Insert comment (replace IDs with real values)
INSERT INTO post_comments (post_id, user_id, message, status)
VALUES (
  'YOUR_POST_ID',      -- From query above
  'DIFFERENT_USER_ID', -- Different from owner_id
  'Test comment to trigger notification',
  'pending'
);

-- Check if notification was created
SELECT * FROM notifications
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:** Notification otomatis ter-create oleh trigger

## Langkah 4: Test dari Web

### Scenario A: Komentar dari User Lain

1. **Logout** atau buka **incognito**
2. **Login** sebagai user berbeda (bukan admin)
3. Buka `/tentang-saya`
4. **Tulis komentar** di post
5. **Submit**

Kemudian cek di Supabase:

```sql
-- Check if comment was inserted
SELECT * FROM post_comments
ORDER BY created_at DESC
LIMIT 1;

-- Check if notification was created
SELECT * FROM notifications
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:**

- Comment ada di `post_comments` dengan status 'pending'
- Notification ada di `notifications` untuk post owner

### Scenario B: Cek Badge di Dashboard

1. **Login** sebagai admin (post owner)
2. **Tunggu** max 30 detik (auto-refresh)
3. **Lihat** icon bell di header
4. **Badge** seharusnya muncul dengan angka

**Expected:**

- Badge muncul dengan angka unread
- Klik bell → drawer terbuka
- Notifikasi tampil di list

## Langkah 5: Troubleshooting

### Problem: Notification Tidak Ter-create Saat Comment

**Debug Steps:**

1. **Cek apakah comment berhasil insert:**

```sql
SELECT * FROM post_comments ORDER BY created_at DESC LIMIT 1;
```

2. **Cek apakah trigger ada:**

```sql
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'trigger_notify_post_owner';
```

3. **Cek logs di Supabase:**

   - Buka Supabase Dashboard
   - Pergi ke **Logs** → **Postgres Logs**
   - Cari NOTICE atau WARNING dari trigger

4. **Test trigger manual:**

```sql
-- This will show if trigger fires
INSERT INTO post_comments (post_id, user_id, message, status)
SELECT
  id,
  'DIFFERENT_USER_ID',
  'Manual test',
  'pending'
FROM user_posts
LIMIT 1;
```

### Problem: Badge Tidak Muncul

**Debug Steps:**

1. **Cek data di database:**

```sql
SELECT * FROM notifications
WHERE user_id = 'YOUR_USER_ID'
AND is_read = false;
```

2. **Cek console browser (F12):**

   - Lihat error di Console tab
   - Lihat Network tab untuk request ke Supabase
   - Cek apakah `getUserNotifications()` dipanggil

3. **Cek user logged in:**

```javascript
// Di browser console
console.log(user?.id);
```

4. **Hard refresh:**
   - Ctrl + Shift + R
   - Clear cache jika perlu

### Problem: RLS Policy Error

**Symptoms:** Error "permission denied" atau "policy violation"

**Fix:**

```sql
-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'notifications';

-- If wrong, run complete_notification_setup.sql again
```

## Checklist Akhir

Sebelum declare success, pastikan:

- [ ] Tabel `notifications` ada dan punya data
- [ ] Kolom `status` ada di `post_comments`
- [ ] Trigger `trigger_notify_post_owner` ada
- [ ] Function `notify_post_owner` ada
- [ ] RLS policies untuk `notifications` benar
- [ ] Test manual insert notification berhasil
- [ ] Test trigger dengan insert comment berhasil
- [ ] Comment dari web create notification
- [ ] Badge muncul di dashboard
- [ ] Klik badge buka drawer dengan notifikasi
- [ ] Mark as read berfungsi

## Common Mistakes

### ❌ Mistake 1: Trigger Syntax Error

**Problem:** Function delimiter salah (`$` vs `$$`)
**Fix:** Gunakan `$$` untuk delimiter

### ❌ Mistake 2: RLS Too Strict

**Problem:** Trigger tidak bisa insert karena RLS
**Fix:** Policy INSERT harus `WITH CHECK (true)`

### ❌ Mistake 3: Missing Status Column

**Problem:** Comment insert error karena status column tidak ada
**Fix:** Run `complete_notification_setup.sql`

### ❌ Mistake 4: Wrong User ID

**Problem:** Notification ter-create tapi untuk user yang salah
**Fix:** Cek `post_owner_id` di trigger function

### ❌ Mistake 5: Badge Not Updating

**Problem:** Notification ada tapi badge tidak muncul
**Fix:** Tunggu 30 detik atau refresh drawer

## Success Criteria

✅ **Database Level:**

- Notifications ter-create otomatis saat ada comment
- Data lengkap (user_id, type, title, message, link)
- is_read = false untuk notification baru

✅ **UI Level:**

- Badge muncul dengan angka unread
- Drawer menampilkan list notifications
- Mark as read berfungsi
- Tabs (All, Unread, Read) berfungsi

✅ **User Experience:**

- Admin dapat notifikasi saat ada comment baru
- Badge update dalam 30 detik
- Klik notification bisa navigate ke post
- Approve/reject comment dari notification

## Next Steps

Setelah semua berfungsi:

1. Test dengan multiple users
2. Test dengan multiple comments
3. Test mark all as read
4. Test notification links
5. Consider implementing real-time (Supabase Realtime)

## Support

Jika masih ada masalah:

1. Share hasil dari `diagnose_all_tables.sql`
2. Share screenshot error dari console
3. Share hasil test manual insert
4. Share Postgres logs dari Supabase
