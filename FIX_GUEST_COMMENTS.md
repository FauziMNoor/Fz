# Fix Guest Comments Support

## Problem

Error saat menambahkan comment:

```
addPostComment error: {}
```

**Root Cause:**

1. Function `addPostComment` tidak support guest parameters (guestName, guestEmail)
2. Tabel `post_comments` tidak punya kolom `guest_name` dan `guest_email`
3. Kolom `user_id` adalah NOT NULL, tidak bisa null untuk guest
4. RLS policy tidak allow guest comments

## Solution

### 1. ✅ Update Function (DONE)

File: `src/lib/supabase-client.js`

Updated `addPostComment` function to accept guest parameters:

```javascript
export async function addPostComment(postId, userId, message, guestName = null, guestEmail = null) {
  const commentData = {
    post_id: postId,
    user_id: userId,
    message,
  };

  // Add guest info if provided
  if (guestName) commentData.guest_name = guestName;
  if (guestEmail) commentData.guest_email = guestEmail;

  // ... insert to database
}
```

### 2. 🔧 Run Database Migration (TODO)

**Steps:**

1. Go to Supabase Dashboard:
   https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor

2. Open SQL Editor

3. Copy & paste content from:
   `supabase_migrations/add_guest_comments_support.sql`

4. Click "Run"

**What the migration does:**

**Columns:**

- ✅ Add `guest_name` column (TEXT, nullable)
- ✅ Add `guest_email` column (TEXT, nullable)
- ✅ Add `status` column (TEXT, default 'pending') - for moderation
- ✅ Make `user_id` nullable
- ✅ Update existing comments to 'approved' status

**Constraints:**

- ✅ Add constraint: either user_id OR (guest_name + guest_email) required

**RLS Policies:**

- ✅ SELECT: Show approved comments OR own comments OR if you're the post owner
- ✅ INSERT: Authenticated users can create comments with their user_id
- ✅ INSERT: Guests can create comments without user_id

**Indexes:**

- ✅ Add index for status column
- ✅ Add index for guest_email column

**Trigger:**

- ✅ Update notification trigger to handle guest comments
- ✅ Use guest_name if user_id is null

### 3. Test

After running migration, test:

**Logged-in user comment:**

```javascript
await addPostComment(postId, userId, 'Hello!');
// Should work ✅
// Creates comment with user_id, status='pending'
```

**Guest comment:**

```javascript
await addPostComment(postId, null, 'Hello!', 'John Doe', 'john@example.com');
// Should work ✅
// Creates comment with guest_name, guest_email, status='pending'
```

**Comment visibility:**

- ✅ Approved comments visible to everyone
- ✅ Pending/rejected comments visible only to:
  - Comment author (if logged in)
  - Post owner (for moderation)

**Notifications:**

- ✅ Post owner gets notified when new comment added
- ✅ Notification shows commenter name (from profile or guest_name)
- ✅ Notification title: "New Comment (Pending Approval)"

## Files Modified

- ✅ `src/lib/supabase-client.js` - Updated addPostComment function
- ✅ `supabase_migrations/add_guest_comments_support.sql` - New migration (combines guest + moderation)

## Next Steps

1. ✅ Run the migration in Supabase SQL Editor
2. Test commenting as logged-in user
3. Test commenting as guest (on public profile page `/tentang-saya`)
4. Verify comments appear with correct status (pending)
5. Test admin approval/rejection of comments
6. Verify notifications are created for post owner
7. Verify approved comments visible to public, pending only to owner

## Related Files

- `supabase_migrations/add_comment_moderation.sql` - Old moderation migration (superseded)
- `src/sections/user/profile-post-item.jsx` - Comment form component
- `src/sections/user/profile-post-comment.jsx` - Comment display component
