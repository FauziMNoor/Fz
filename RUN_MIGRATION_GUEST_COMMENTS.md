# 🚀 Quick Guide: Run Guest Comments Migration

## Step-by-Step

### 1. Open Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor

### 2. Create New Query

Click "+ New query" button

### 3. Copy Migration SQL

Open file: `supabase_migrations/add_guest_comments_support.sql`

Copy ALL content (Ctrl+A, Ctrl+C)

### 4. Paste & Run

Paste into SQL Editor and click "Run" button

### 5. Verify Success

You should see output showing:

- ✅ Columns added successfully
- ✅ Policies created
- ✅ Indexes created
- ✅ Trigger updated

Check the verification queries at the end:

```sql
-- Should show columns: id, post_id, user_id, message, guest_name, guest_email, status, created_at, updated_at
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'post_comments';

-- Should show 3 policies: View approved, Authenticated users, Guests
SELECT policyname FROM pg_policies WHERE tablename = 'post_comments';
```

## What Changed?

### Database Schema

**Before:**

```sql
post_comments (
  id UUID,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,  -- ❌ Can't be null
  message TEXT,
  created_at TIMESTAMPTZ
)
```

**After:**

```sql
post_comments (
  id UUID,
  post_id UUID NOT NULL,
  user_id UUID,           -- ✅ Can be null for guests
  message TEXT,
  guest_name TEXT,        -- ✅ NEW
  guest_email TEXT,       -- ✅ NEW
  status TEXT,            -- ✅ NEW (pending/approved/rejected)
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### RLS Policies

**Before:**

- Anyone can view all comments
- Users can only create comments with their user_id

**After:**

- Only approved comments visible to public
- Pending/rejected visible to author & post owner
- Authenticated users can create with user_id
- Guests can create with guest_name + guest_email

## Test After Migration

### Test 1: Logged-in User Comment

1. Login to app: http://localhost:3032/auth/supabase/sign-in
2. Go to: http://localhost:3032/dashboard/user
3. Try to add a comment
4. Should work ✅

### Test 2: Guest Comment

1. Logout or open incognito window
2. Go to: http://localhost:3032/tentang-saya
3. Try to add a comment (will ask for name & email)
4. Should work ✅

### Test 3: Comment Moderation

1. Login as admin
2. Go to: http://localhost:3032/dashboard/user
3. See pending comments with badge
4. Click menu → Approve or Reject
5. Should work ✅

### Test 4: Notifications

1. Login as admin
2. Add a comment on your own post (should NOT notify)
3. Login as different user
4. Add a comment on admin's post
5. Admin should get notification ✅

## Troubleshooting

### Error: "column already exists"

This means you already ran part of the migration. Safe to ignore if using `IF NOT EXISTS`.

### Error: "policy already exists"

The migration drops old policies first, so this shouldn't happen. If it does, manually drop the policy:

```sql
DROP POLICY IF EXISTS "policy_name" ON post_comments;
```

### Error: "constraint already exists"

Drop the old constraint first:

```sql
ALTER TABLE post_comments DROP CONSTRAINT IF EXISTS check_user_or_guest;
```

## Rollback (if needed)

If something goes wrong, you can rollback:

```sql
-- Remove guest columns
ALTER TABLE post_comments DROP COLUMN IF EXISTS guest_name;
ALTER TABLE post_comments DROP COLUMN IF EXISTS guest_email;
ALTER TABLE post_comments DROP COLUMN IF EXISTS status;

-- Make user_id NOT NULL again
ALTER TABLE post_comments ALTER COLUMN user_id SET NOT NULL;

-- Restore simple policies
DROP POLICY IF EXISTS "View approved comments or own comments" ON post_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON post_comments;
DROP POLICY IF EXISTS "Guests can create comments" ON post_comments;

CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Need Help?

Check these files:

- `FIX_GUEST_COMMENTS.md` - Detailed explanation
- `supabase_migrations/add_guest_comments_support.sql` - The migration SQL
- `src/lib/supabase-client.js` - Updated function
