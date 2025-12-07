# Summary: Guest Comments Fix

## Problem Fixed

Error saat menambahkan comment: `addPostComment error: {}`

## Root Causes Identified

1. ❌ Function `addPostComment` tidak support guest parameters
2. ❌ Database tabel `post_comments` tidak punya kolom untuk guest
3. ❌ Kolom `user_id` adalah NOT NULL (tidak bisa null untuk guest)
4. ❌ RLS policies tidak allow guest comments
5. ❌ Function `getUserPosts` tidak fetch comments
6. ❌ Comment display tidak show guest names

## Solutions Implemented

### 1. ✅ Updated `addPostComment` Function

**File:** `src/lib/supabase-client.js`

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

**Changes:**

- Added `guestName` and `guestEmail` parameters
- Conditionally add guest fields to insert data

### 2. ✅ Updated `getUserPosts` Function

**File:** `src/lib/supabase-client.js`

```javascript
export async function getUserPosts(userId) {
  // 1. Fetch posts
  // 2. Fetch comments (including guest comments)
  // 3. Fetch profiles for all users
  // 4. Map comments to posts with author data
  // 5. Return posts with comments
}
```

**Changes:**

- Now fetches comments for all posts
- Includes guest comments (user_id = null)
- Maps author profiles to comments
- Returns posts with nested comments array

### 3. ✅ Updated Comment Display

**File:** `src/sections/user/profile-post-item.jsx`

```javascript
// Get commenter name (from author profile or guest name)
const commenterName = comment.author?.name || comment.guest_name || 'User';
const isGuest = !comment.author && comment.guest_name;

// Show avatar with initial if no image
<Avatar alt={commenterName} src={comment.author?.avatarUrl}>
  {!comment.author?.avatarUrl && commenterName.charAt(0).toUpperCase()}
</Avatar>

// Show name with (Guest) label
<Box sx={{ typography: 'subtitle2' }}>
  {commenterName}
  {isGuest && <span>(Guest)</span>}
</Box>
```

**Changes:**

- Display guest_name if author is null
- Show "(Guest)" label for guest comments
- Show avatar with initial letter for guests

### 4. 🔧 Database Migration (TODO)

**File:** `supabase_migrations/add_guest_comments_support.sql`

**Must run in Supabase SQL Editor!**

**Changes:**

- Add `guest_name` column (TEXT, nullable)
- Add `guest_email` column (TEXT, nullable)
- Add `status` column (TEXT, default 'pending')
- Make `user_id` nullable
- Add constraint: either user_id OR (guest_name + guest_email) required
- Update RLS policies:
  - SELECT: Show approved comments OR own comments OR if post owner
  - INSERT: Authenticated users can create with user_id
  - INSERT: Guests can create with guest_name + guest_email
- Update notification trigger to handle guest comments
- Add indexes for performance

## Files Modified

1. ✅ `src/lib/supabase-client.js`

   - Updated `addPostComment()` - Added guest parameters
   - Updated `getUserPosts()` - Fetch comments with guest support

2. ✅ `src/sections/user/profile-post-item.jsx`

   - Updated comment display - Show guest names
   - Added "(Guest)" label for guest comments
   - Show avatar with initial for guests

3. ✅ `supabase_migrations/add_guest_comments_support.sql`

   - New migration file (must be run manually)

4. ✅ `FIX_GUEST_COMMENTS.md`

   - Detailed documentation

5. ✅ `RUN_MIGRATION_GUEST_COMMENTS.md`
   - Step-by-step guide to run migration

## Testing Checklist

After running the migration:

### Test 1: Logged-in User Comment

- [ ] Login to app
- [ ] Go to `/dashboard/user`
- [ ] Add a comment
- [ ] Comment should appear with status "PENDING"
- [ ] Comment should show your name and avatar

### Test 2: Guest Comment

- [ ] Logout or use incognito
- [ ] Go to `/tentang-saya`
- [ ] Try to add a comment
- [ ] Should ask for name and email
- [ ] Comment should appear with status "PENDING"
- [ ] Comment should show guest name with "(Guest)" label

### Test 3: Comment Moderation

- [ ] Login as admin
- [ ] See pending comments with badge
- [ ] Click menu → Approve
- [ ] Comment status changes to approved
- [ ] Badge disappears

### Test 4: Comment Visibility

- [ ] Approved comments visible to everyone
- [ ] Pending comments visible only to:
  - Comment author (if logged in)
  - Post owner
- [ ] Rejected comments visible only to:
  - Comment author (if logged in)
  - Post owner

### Test 5: Notifications

- [ ] Post owner gets notified when comment added
- [ ] Notification shows correct commenter name
- [ ] For guest: shows guest_name
- [ ] For user: shows full_name from profile

## Next Steps

1. **IMPORTANT:** Run the migration in Supabase SQL Editor
   - Follow guide in `RUN_MIGRATION_GUEST_COMMENTS.md`
2. Test all scenarios above

3. If any issues, check:

   - Browser console for errors
   - Supabase logs for database errors
   - Network tab for failed requests

4. Optional improvements:
   - Add email validation for guest comments
   - Add rate limiting for guest comments
   - Add CAPTCHA for guest comments
   - Send email notification to guests when comment approved

## Rollback Plan

If something goes wrong, see rollback instructions in:
`RUN_MIGRATION_GUEST_COMMENTS.md`

## Related Documentation

- `FIX_GUEST_COMMENTS.md` - Detailed explanation
- `RUN_MIGRATION_GUEST_COMMENTS.md` - Migration guide
- `COMMENT_MODERATION_GUIDE.md` - Moderation system docs
- `mulai_dari_sini.md` - Main documentation
