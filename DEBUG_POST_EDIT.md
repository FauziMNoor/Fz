# 🔍 DEBUG: Post Edit Error

## ❌ Error:

```
Error fetching post: {}
Cannot edit post with slug: 34534-yurt
```

## 🔍 Diagnosis Steps:

### Step 1: Check if Post Exists

Run this query in Supabase SQL Editor:

```sql
-- Check all posts
SELECT id, title, slug, status, created_at
FROM posts
ORDER BY created_at DESC
LIMIT 10;
```

**Look for:**

- Post with slug `34534-yurt`
- Or post with title "34534 yurt"

### Step 2: Check Exact Slug

```sql
-- Search by slug
SELECT * FROM posts WHERE slug = '34534-yurt';

-- Search by similar slug
SELECT * FROM posts WHERE slug LIKE '%34534%';

-- Search by title
SELECT * FROM posts WHERE title LIKE '%34534%' OR title LIKE '%yurt%';
```

### Step 3: If Post Not Found

**Possible causes:**

1. Post creation failed
2. Slug generation error
3. Post was deleted

**Solution:** Create post again with proper data.

---

## ✅ Quick Fix: Create Post Properly

### Method 1: Via Dashboard

1. **Go to create page:**

   ```
   http://localhost:3032/dashboard/post/new
   ```

2. **Fill ALL required fields:**

   - ✅ Title: "Test Artikel Baru"
   - ✅ Description: "Deskripsi artikel test"
   - ✅ Content: (min 100 characters)
   - ✅ Cover: Upload image
   - ✅ Categories: Select at least 1
   - ✅ Tags: Add at least 2
   - ✅ Meta keywords: Add at least 1

3. **Submit**

4. **Check slug in list:**
   - Should be: `test-artikel-baru`
   - URL: `/dashboard/post/test-artikel-baru/edit`

### Method 2: Via SQL (Manual Insert)

```sql
-- Get your user ID first
SELECT id FROM auth.users WHERE email = 'fauzimnoor90@gmail.com';
-- Copy the ID

-- Insert post manually
INSERT INTO posts (
  title,
  slug,
  description,
  content,
  tags,
  meta_keywords,
  status,
  author_id
) VALUES (
  'Test Artikel',
  'test-artikel',
  'Deskripsi test',
  '<p>Ini adalah konten test artikel yang memiliki lebih dari 100 karakter untuk memenuhi requirement minimum dari form validation.</p>',
  ARRAY['test', 'artikel'],
  ARRAY['test'],
  'draft',
  'YOUR_USER_ID_HERE'  -- Replace with your ID
) RETURNING *;
```

---

## 🐛 Common Issues:

### Issue 1: Slug Contains Numbers Only

**Problem:**

```
Title: "34534 yurt"
Slug: "34534-yurt"  ❌ Weird slug
```

**Solution:** Use descriptive title

```
Title: "Artikel Tentang Yurt"
Slug: "artikel-tentang-yurt"  ✅ Better
```

### Issue 2: Special Characters in Title

**Problem:**

```
Title: "Test!@#$%"
Slug: "test"  ❌ Too short
```

**Solution:** Use alphanumeric characters

```
Title: "Test Artikel Baru"
Slug: "test-artikel-baru"  ✅ Good
```

### Issue 3: Duplicate Slug

**Problem:**

```
Error: duplicate key value violates unique constraint "posts_slug_key"
```

**Solution:** Change title slightly

```
Title: "Test Artikel 2"
Slug: "test-artikel-2"  ✅ Unique
```

---

## 🔧 Fix Avatar 404 Error

The avatar error is separate issue:

```
Failed to load: /assets/images/avatar/avatar-25.webp
```

**This is just a fallback avatar issue, not critical.**

**To fix:**

1. Upload your avatar in account settings
2. Or ignore (doesn't affect functionality)

---

## 📊 Verify Post Data

After creating post, verify:

```sql
-- Check post details
SELECT
  id,
  title,
  slug,
  status,
  author_id,
  created_at
FROM posts
WHERE slug = 'your-post-slug';

-- Check if you can access it
-- URL: /dashboard/post/your-post-slug/edit
```

---

## 🚀 Recommended Action:

1. **Delete problematic post:**

   ```sql
   DELETE FROM posts WHERE slug = '34534-yurt';
   ```

2. **Create new post with proper title:**

   - Title: "Artikel Test Baru"
   - Fill all required fields
   - Submit

3. **Test edit:**
   ```
   http://localhost:3032/dashboard/post/artikel-test-baru/edit
   ```

Should work! ✅

---

## 📝 Best Practices for Post Titles:

✅ **Good titles:**

- "Pendidikan Agile di Era Digital"
- "Cara Menerapkan Scrum di Kelas"
- "Tips Kepemimpinan untuk Guru"

❌ **Bad titles:**

- "34534 yurt" (numbers + random word)
- "test" (too short)
- "!@#$%" (special characters only)

---

**Need help?** Run the SQL queries above and share the results!
