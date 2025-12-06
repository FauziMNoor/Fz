# ✅ Checklist - Fix Comments System

## Current Status

❌ **Comments NOT working** - Error: "Could not find the 'guest_email' column"

## What You Need To Do

### ☐ Step 1: Run Migration (REQUIRED!)

1. Open: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor
2. Click: "+ New query"
3. Open file: `supabase_migrations/add_guest_comments_support.sql`
4. Copy ALL content
5. Paste to SQL Editor
6. Click "Run"
7. Wait for success

**Expected output:**

- ✅ Columns added: guest_name, guest_email, status
- ✅ Policies created: 3 policies
- ✅ Trigger updated: notify_post_owner

### ☐ Step 2: Refresh Browser

1. Close all browser tabs
2. Clear cache (Ctrl+Shift+Delete)
3. Reopen: http://localhost:3032

### ☐ Step 3: Test Comments

**Test 1: Logged-in user**

- [ ] Login to dashboard
- [ ] Go to /dashboard/user
- [ ] Add a comment
- [ ] Should work without error

**Test 2: Guest user**

- [ ] Logout or use incognito
- [ ] Go to /tentang-saya
- [ ] Add comment with name & email
- [ ] Should work without error

**Test 3: Notification**

- [ ] Login as admin
- [ ] See notification badge
- [ ] Open notification drawer
- [ ] See pending comment
- [ ] See Approve/Reject buttons

**Test 4: Approve**

- [ ] Click Approve button
- [ ] See success message
- [ ] Comment appears in list

**Test 5: Reject**

- [ ] Add another comment
- [ ] Click Reject button
- [ ] Confirm rejection
- [ ] Comment stays hidden

## Files Already Updated (Done ✅)

- ✅ `src/lib/supabase-client.js` - Functions updated
- ✅ `src/sections/user/profile-post-item.jsx` - UI updated
- ✅ `src/layouts/components/notifications-drawer/notification-item.jsx` - Buttons added
- ✅ `supabase_migrations/add_guest_comments_support.sql` - Migration ready

## What's Left

- ⚠️ **RUN THE MIGRATION!** (Step 1 above)

## Quick Links

- Migration file: `supabase_migrations/add_guest_comments_support.sql`
- Supabase Editor: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor
- Detailed guide: `RUN_THIS_MIGRATION_NOW.md`

## If Still Not Working

1. Check browser console for errors
2. Check Supabase logs
3. Verify columns exist:
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'post_comments';
   ```
4. Restart Supabase project (Settings → Restart)
5. Clear browser cache completely
6. Restart dev server

---

**Bottom line:** Migration belum dijalankan, makanya error. Run migration dulu!
