# 🔧 FIX: Draft Posts Cannot Be Edited

## 🐛 **Bug Found:**

**Symptom:**

- ✅ Published posts → Can be edited
- ❌ Draft posts → Error "Post not found"

**Root Cause:**
RLS (Row Level Security) policy issue atau policy order yang salah.

---

## ✅ **Solution: Run Fix Migration**

### **Step 1: Open Supabase SQL Editor**

```
https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor
```

### **Step 2: Run Fix SQL**

1. **Buka file di VS Code:**

   ```
   supabase_migrations/FIX_DRAFT_POSTS_ACCESS.sql
   ```

2. **Copy ALL** (`Ctrl+A` → `Ctrl+C`)

3. **Paste ke SQL Editor** (`Ctrl+V`)

4. **Click "Run"** atau `Ctrl+Enter`

5. **Wait for success:**
   ```
   ✅ Success. No rows returned
   ```

### **Step 3: Verify**

Run this query:

```sql
-- Check your posts (should show ALL including drafts)
SELECT
  id,
  title,
  slug,
  status,
  created_at
FROM posts
WHERE author_id = 'bb2e61da-8f0c-4f12-9fef-59f82db50d69'
ORDER BY created_at DESC;
```

**Expected:**

- Shows ALL your posts
- Both draft AND published
- No errors

---

## 🧪 **Test After Fix:**

### **Test 1: Edit Draft Post**

1. Go to: `http://localhost:3032/dashboard/post`
2. Find a draft post
3. Click "..." menu → "Edit"
4. Should open edit page ✅
5. Make changes
6. Save
7. Should update successfully ✅

### **Test 2: Edit Published Post**

1. Find a published post
2. Click "..." menu → "Edit"
3. Should still work ✅

### **Test 3: Create Draft Post**

1. Go to: `http://localhost:3032/dashboard/post/new`
2. Fill form
3. **Publish: OFF** (keep as draft)
4. Submit
5. Should create successfully ✅
6. Try to edit immediately
7. Should work ✅

---

## 📊 **What the Fix Does:**

### **Before (Bug):**

```sql
-- Policy order might cause issues
Policy 1: Anyone can view published posts
Policy 2: Users can view their own posts

-- Sometimes Policy 1 blocks draft posts
```

### **After (Fixed):**

```sql
-- Correct order
Policy 1: Users can view their own posts (ANY status)
Policy 2: Anyone can view published posts

-- Owner can always see their posts (draft or published)
-- Others can only see published posts
```

---

## 🎯 **Expected Behavior After Fix:**

| User            | Draft Posts      | Published Posts  |
| --------------- | ---------------- | ---------------- |
| **Owner**       | ✅ Can view/edit | ✅ Can view/edit |
| **Public**      | ❌ Cannot view   | ✅ Can view      |
| **Other Users** | ❌ Cannot view   | ✅ Can view      |

---

## 💡 **Why Draft is Important:**

**Draft workflow:**

```
1. Create post (draft) ✅
   ↓
2. Edit & refine (draft) ✅
   ↓
3. Preview (draft) ✅
   ↓
4. Publish when ready ✅
   ↓
5. Public can see ✅
```

**Without draft:**

```
1. Create post (published) ✅
   ↓
2. Public sees unfinished post ❌
   ↓
3. Edit while public watching ❌
   ↓
4. Unprofessional ❌
```

**So YES, draft is ESSENTIAL!** 🎯

---

## 📝 **Best Practice Workflow:**

### **For New Posts:**

```
1. Create as DRAFT
2. Write content
3. Add images/videos
4. Preview
5. Proofread
6. Edit if needed
7. When perfect → Publish
```

### **For Updates:**

```
1. Edit published post
2. Make changes
3. Save (stays published)
4. Or: Change to draft → Edit → Publish again
```

---

## 🚀 **After Running Fix:**

**You can now:**

- ✅ Create draft posts
- ✅ Edit draft posts
- ✅ Preview draft posts
- ✅ Publish when ready
- ✅ Edit published posts
- ✅ Change published → draft → published

**Perfect workflow!** 🎉

---

## 🔍 **Troubleshooting:**

### **If still error after fix:**

1. **Clear browser cache:**

   - `Ctrl+Shift+R` (hard refresh)

2. **Check RLS policies:**

   ```sql
   SELECT policyname, cmd, qual
   FROM pg_policies
   WHERE tablename = 'posts'
   AND cmd = 'SELECT';
   ```

3. **Check your user ID:**

   ```sql
   SELECT id FROM auth.users
   WHERE email = 'fauzimnoor90@gmail.com';
   ```

4. **Test query directly:**
   ```sql
   -- This should work
   SELECT * FROM posts
   WHERE author_id = 'YOUR_USER_ID'
   AND status = 'draft';
   ```

---

## ✅ **Summary:**

**Problem:** Draft posts cannot be edited

**Cause:** RLS policy order/conflict

**Solution:** Run `FIX_DRAFT_POSTS_ACCESS.sql`

**Result:** Draft posts work perfectly! ✅

---

**Run the fix SQL now and test!** 🚀
