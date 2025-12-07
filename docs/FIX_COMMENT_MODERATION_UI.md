# Fix Comment Moderation UI

## Problem

Tombol Approve/Reject muncul langsung di kolom komentar, padahal seharusnya:

1. ❌ Pending comments TIDAK tampil di kolom komentar
2. ✅ Pending comments hanya muncul di notification
3. ✅ Tombol Approve/Reject ada di notification drawer

## Solution Implemented

### 1. ✅ Hide Pending Comments from Comment List

**File:** `src/sections/user/profile-post-item.jsx`

**Changes:**

- Filter comments to only show `status === 'approved'`
- Remove PENDING and REJECTED badges
- Remove inline Approve/Reject buttons
- Simplify comment display (no special styling for status)

**Before:**

```javascript
// Showed ALL comments (pending, approved, rejected)
{
  (post.comments || []).map((comment) => {
    const isPending = comment.status === 'pending';
    // ... show with badges and buttons
  });
}
```

**After:**

```javascript
// Only show APPROVED comments
const approvedComments = (post.comments || []).filter((comment) => comment.status === 'approved');

{
  approvedComments.map((comment) => {
    // ... simple display, no badges or buttons
  });
}
```

### 2. ✅ Add Approve/Reject to Notification Drawer

**File:** `src/layouts/components/notifications-drawer/notification-item.jsx`

**Changes:**

- Extract `comment_id` from notification link
- Add `handleApprove()` and `handleReject()` functions
- Add `renderCommentAction()` to show buttons
- Call `onRefresh()` after approve/reject to update list

**New Features:**

```javascript
// Extract comment ID from link
const commentId = getCommentId(); // from ?comment_id=xxx

// Approve button
<Button
  variant="contained"
  color="success"
  startIcon={<Iconify icon="eva:checkmark-fill" />}
  onClick={handleApprove}
>
  Approve
</Button>

// Reject button
<Button
  variant="outlined"
  color="error"
  startIcon={<Iconify icon="eva:close-fill" />}
  onClick={handleReject}
>
  Reject
</Button>
```

### 3. 🔧 Update Notification Trigger (TODO)

**File:** `supabase_migrations/update_comment_notification_with_id.sql`

**Must run in Supabase SQL Editor!**

**Changes:**

- Include `comment_id` in notification link
- Support guest comments (use guest_name if user_id is null)
- Link format: `/dashboard/user?comment_id=<uuid>`

**Before:**

```sql
link: '/dashboard/user'
```

**After:**

```sql
link: '/dashboard/user?comment_id=' || NEW.id
```

## User Flow

### For Admin (Post Owner):

1. **User adds comment** (logged in or guest)

   - Comment created with `status = 'pending'`
   - Notification created for post owner
   - Comment NOT visible in comment list

2. **Admin sees notification**

   - Badge shows unread count
   - Opens notification drawer
   - Sees: "New Comment (Pending Approval)"
   - Sees: Approve and Reject buttons

3. **Admin clicks Approve**

   - Comment status → 'approved'
   - Comment now visible in comment list
   - Notification can be marked as read

4. **Admin clicks Reject**
   - Comment status → 'rejected'
   - Comment stays hidden from comment list
   - Notification can be marked as read

### For Public Users:

1. **View post**

   - Only see approved comments
   - No pending/rejected comments visible
   - No moderation buttons visible

2. **Add comment**
   - Submit comment (with name/email if guest)
   - See success message: "Comment submitted! It will appear after approval."
   - Comment not immediately visible
   - Wait for admin approval

## Files Modified

1. ✅ `src/sections/user/profile-post-item.jsx`

   - Removed inline Approve/Reject buttons
   - Filter to show only approved comments
   - Removed unused imports and functions

2. ✅ `src/layouts/components/notifications-drawer/notification-item.jsx`

   - Added Approve/Reject buttons for comment notifications
   - Extract comment_id from link
   - Handle approve/reject actions
   - Refresh notification list after action

3. ✅ `supabase_migrations/update_comment_notification_with_id.sql`
   - Update trigger to include comment_id in link
   - Support guest comments

## Testing Checklist

### Test 1: Comment Visibility

- [ ] Login as admin
- [ ] Go to `/dashboard/user`
- [ ] Only approved comments visible
- [ ] No pending comments in list
- [ ] No PENDING badges
- [ ] No Approve/Reject buttons in comments

### Test 2: Add Comment (Logged In)

- [ ] Login as different user
- [ ] Go to `/dashboard/user` (admin's profile)
- [ ] Add a comment
- [ ] Comment NOT immediately visible
- [ ] See success message
- [ ] Admin gets notification

### Test 3: Add Comment (Guest)

- [ ] Logout or use incognito
- [ ] Go to `/tentang-saya`
- [ ] Add comment with name and email
- [ ] Comment NOT immediately visible
- [ ] See success message
- [ ] Admin gets notification

### Test 4: Notification Badge

- [ ] Login as admin
- [ ] See notification badge with count
- [ ] Badge shows number of unread notifications
- [ ] Click badge to open drawer

### Test 5: Approve from Notification

- [ ] Open notification drawer
- [ ] See pending comment notification
- [ ] See Approve and Reject buttons
- [ ] Click Approve
- [ ] See success toast
- [ ] Notification list refreshes
- [ ] Go to profile, comment now visible

### Test 6: Reject from Notification

- [ ] Add another comment
- [ ] Open notification drawer
- [ ] Click Reject
- [ ] Confirm rejection
- [ ] See success toast
- [ ] Notification list refreshes
- [ ] Comment stays hidden

## Next Steps

1. **IMPORTANT:** Run the migration in Supabase SQL Editor

   - File: `supabase_migrations/update_comment_notification_with_id.sql`
   - This updates the trigger to include comment_id in link

2. Test all scenarios above

3. Optional improvements:
   - Add "View Comment" button in notification to see full comment text
   - Add comment preview in notification message
   - Add bulk approve/reject for multiple comments
   - Add filter in notification drawer for comment notifications only

## Related Files

- `FIX_GUEST_COMMENTS.md` - Guest comment support
- `COMMENT_MODERATION_GUIDE.md` - Moderation system overview
- `NOTIFICATION_SETUP_GUIDE.md` - Notification system setup
- `mulai_dari_sini.md` - Main documentation
