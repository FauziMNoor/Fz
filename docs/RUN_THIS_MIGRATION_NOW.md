# 🚨 RUN THIS MIGRATION NOW!

## Error Yang Terjadi

```
Could not find the 'guest_email' column of 'post_comments' in the schema cache
```

**Artinya:** Kolom `guest_email` dan `guest_name` belum ada di database!

## Solution: Jalankan Migration

### Step 1: Buka Supabase SQL Editor

URL: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor

### Step 2: Buat Query Baru

Klik tombol **"+ New query"**

### Step 3: Copy Migration SQL

Buka file: **`supabase_migrations/add_guest_comments_support.sql`**

Copy **SEMUA ISI FILE** (dari baris pertama sampai terakhir)

### Step 4: Paste & Run

1. Paste ke SQL Editor
2. Klik tombol **"Run"** (atau tekan Ctrl+Enter)
3. Tunggu sampai selesai

### Step 5: Verify Success

Setelah run, cek output di bagian bawah. Harusnya muncul:

**Columns:**

```
column_name      | data_type | is_nullable
-----------------+-----------+-------------
id               | uuid      | NO
post_id          | uuid      | NO
user_id          | uuid      | YES          ← Changed to nullable
message          | text      | NO
guest_name       | text      | YES          ← NEW!
guest_email      | text      | YES          ← NEW!
status           | text      | YES          ← NEW!
created_at       | timestamp | YES
updated_at       | timestamp | YES
```

**Policies:**

```
policyname
------------------------------------------
View approved comments or own comments
Authenticated users can create comments
Guests can create comments
```

### Step 6: Test

Setelah migration berhasil:

1. **Refresh browser** (Ctrl+F5)
2. **Coba add comment** (logged in atau guest)
3. **Harusnya berhasil!**

## What This Migration Does

1. ✅ Add `guest_name` column
2. ✅ Add `guest_email` column
3. ✅ Add `status` column (pending/approved/rejected)
4. ✅ Make `user_id` nullable (untuk guest)
5. ✅ Add constraint: user_id OR (guest_name + guest_email)
6. ✅ Update RLS policies untuk guest
7. ✅ Update notification trigger dengan comment_id

## Troubleshooting

### Error: "column already exists"

Jika ada error "column already exists", berarti sebagian migration sudah jalan. Coba run query ini untuk cek:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'post_comments'
ORDER BY ordinal_position;
```

Jika `guest_email` dan `guest_name` sudah ada, berarti migration sudah jalan. Coba:

1. Refresh browser (Ctrl+F5)
2. Clear cache
3. Restart dev server

### Error: "policy already exists"

Ini normal, migration akan drop policy lama dulu sebelum create yang baru.

### Still Getting Error?

Coba run query ini untuk reset schema cache:

```sql
NOTIFY pgrst, 'reload schema';
```

Atau restart Supabase project:

1. Go to Settings
2. Click "Restart project"
3. Wait 1-2 minutes

## After Migration Success

Setelah migration berhasil, test:

1. **Add comment as logged-in user**

   - Go to: http://localhost:3032/dashboard/user
   - Add comment
   - Should work ✅

2. **Add comment as guest**

   - Logout or incognito
   - Go to: http://localhost:3032/tentang-saya
   - Add comment with name & email
   - Should work ✅

3. **Check notification**
   - Login as admin
   - See notification badge
   - Open drawer
   - See Approve/Reject buttons ✅

## Need Help?

Jika masih error setelah migration:

1. Check browser console untuk error lain
2. Check Supabase logs
3. Verify columns exist dengan query di atas
4. Try refresh/restart

---

**IMPORTANT:** Migration ini WAJIB dijalankan sebelum fitur comment bisa bekerja!
