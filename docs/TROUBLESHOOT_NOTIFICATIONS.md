# Troubleshooting Notifications

## Masalah: Notifikasi Tidak Muncul

### Langkah 1: Cek Tabel Notifications Ada

```sql
SELECT * FROM notifications LIMIT 1;
```

Jika error "relation does not exist":

- Jalankan: `supabase_migrations/create_notifications_table.sql`

### Langkah 2: Test Insert Manual

Jalankan SQL:

```sql
supabase_migrations/test_notification.sql
```

Kemudian:

1. Refresh dashboard
2. Klik icon bell
3. Lihat apakah test notification muncul

**Jika muncul** → Tabel OK, masalah di trigger
**Jika tidak muncul** → Masalah di RLS atau fetch function

### Langkah 3: Cek RLS Policy

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'notifications';
```

Harus ada policy:

- "Users can view their own notifications" (SELECT)
- "System can create notifications" (INSERT)

### Langkah 4: Fix Trigger

Jalankan SQL:

```sql
supabase_migrations/fix_notifications_trigger.sql
```

Ini akan:

- Drop trigger lama
- Buat ulang dengan syntax yang benar
- Verify trigger exists

### Langkah 5: Test Comment

1. Logout atau buka incognito
2. Login sebagai user lain (atau buat user baru)
3. Buka `/tentang-saya`
4. Tulis komentar di post
5. Submit

Kemudian:

1. Login kembali sebagai admin
2. Klik icon bell
3. Seharusnya ada notifikasi baru

### Langkah 6: Cek Console Browser

Buka Console (F12) dan lihat:

- Error saat fetch notifications?
- Error saat insert comment?
- Network tab: cek request ke Supabase

## Debug Checklist

### ✅ Tabel notifications exists

```sql
SELECT table_name FROM information_schema.tables
WHERE table_name = 'notifications';
```

### ✅ RLS enabled

```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE tablename = 'notifications';
```

### ✅ Trigger exists

```sql
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'trigger_notify_post_owner';
```

### ✅ Function exists

```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'notify_post_owner';
```

### ✅ Can insert manually

```sql
INSERT INTO notifications (user_id, type, title, message, link)
VALUES (
  'YOUR_USER_ID',
  'test',
  'Test',
  'Test message',
  '/dashboard'
);
```

### ✅ Can select own notifications

```sql
SELECT * FROM notifications
WHERE user_id = 'YOUR_USER_ID';
```

## Common Issues

### Issue 1: "relation does not exist"

**Solution:** Run `create_notifications_table.sql`

### Issue 2: "permission denied"

**Solution:** Check RLS policies, make sure authenticated users can insert

### Issue 3: Trigger not firing

**Solution:**

1. Run `fix_notifications_trigger.sql`
2. Make sure post_comments table exists
3. Check trigger is AFTER INSERT

### Issue 4: Notifications empty in UI

**Solution:**

1. Check browser console for errors
2. Verify user is logged in
3. Check `getUserNotifications()` function
4. Verify user ID is correct

### Issue 5: Badge shows 0 but notifications exist

**Solution:**

1. Check `is_read` field in database
2. Verify totalUnRead calculation
3. Refresh drawer (close and open)

## Manual Testing

### Test 1: Direct Database Insert

```sql
-- Insert test notification
INSERT INTO notifications (user_id, type, title, message, link, is_read)
VALUES (
  'bb2e61da-8f0c-4f12-9fef-59f82db50d69',
  'comment',
  'Manual Test',
  'This is a manual test notification',
  '/dashboard/user',
  false
);

-- Verify
SELECT * FROM notifications
WHERE user_id = 'bb2e61da-8f0c-4f12-9fef-59f82db50d69'
ORDER BY created_at DESC;
```

### Test 2: Trigger Test

```sql
-- Insert test comment (will trigger notification)
INSERT INTO post_comments (post_id, user_id, message, status)
VALUES (
  'EXISTING_POST_ID',
  'DIFFERENT_USER_ID',
  'Test comment to trigger notification',
  'pending'
);

-- Check if notification was created
SELECT * FROM notifications
ORDER BY created_at DESC LIMIT 1;
```

## Success Criteria

✅ Test notification appears in UI
✅ Badge shows correct unread count
✅ Tabs show correct counts (All, Unread, Read)
✅ Mark all as read works
✅ New comments create notifications automatically
✅ Notification links work

## Still Not Working?

1. **Check Supabase logs** in dashboard
2. **Check browser console** for JavaScript errors
3. **Verify user ID** is correct everywhere
4. **Test with fresh comment** from different user
5. **Clear browser cache** and try again

## Contact Points

If still having issues, check:

- Supabase project URL is correct
- Supabase anon key is correct
- User is authenticated
- Database connection is working
