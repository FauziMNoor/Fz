# 📝 Blog Database Integration - Complete Guide

## 🎯 Overview

Integrasi lengkap form artikel blog dengan Supabase database untuk create, read, update, dan delete posts.

**Status:** ✅ **READY TO USE** (setelah run migration)

---

## 🗄️ Database Schema

### Table: `posts`

**17 Columns:**

| Column             | Type        | Description                                |
| ------------------ | ----------- | ------------------------------------------ |
| `id`               | UUID        | Primary key                                |
| `title`            | TEXT        | Judul artikel (required)                   |
| `slug`             | TEXT        | URL-friendly slug (unique, auto-generated) |
| `description`      | TEXT        | Deskripsi singkat                          |
| `content`          | TEXT        | Konten artikel (HTML dari editor)          |
| `cover_url`        | TEXT        | URL cover image                            |
| `author_id`        | UUID        | Foreign key ke auth.users                  |
| `status`           | TEXT        | draft / published / archived               |
| `published_at`     | TIMESTAMPTZ | Waktu publish (auto-set)                   |
| `meta_title`       | TEXT        | SEO meta title                             |
| `meta_description` | TEXT        | SEO meta description                       |
| `meta_keywords`    | TEXT[]      | SEO keywords array                         |
| `tags`             | TEXT[]      | Tags array                                 |
| `enable_comments`  | BOOLEAN     | Enable/disable comments                    |
| `view_count`       | INTEGER     | Jumlah views                               |
| `created_at`       | TIMESTAMPTZ | Auto-set                                   |
| `updated_at`       | TIMESTAMPTZ | Auto-update                                |

### Table: `categories`

**Default Categories:**

- Pendidikan
- Agile
- Kepemimpinan
- Pesantren
- Teknologi
- Inspirasi

### Table: `post_categories`

Junction table untuk many-to-many relationship antara posts dan categories.

---

## 🚀 Setup Instructions

### Step 1: Run Migration

1. **Buka Supabase Dashboard:**

   ```
   https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
   ```

2. **Pergi ke SQL Editor:**

   - Klik "SQL Editor" di sidebar
   - Klik "New query"

3. **Copy & Paste Migration:**

   - Buka file: `supabase_migrations/create_posts_table.sql`
   - Copy semua isi file
   - Paste ke SQL Editor
   - Klik **"Run"** atau tekan `Ctrl+Enter`

4. **Verify:**

   ```sql
   -- Check if table exists
   SELECT EXISTS (
     SELECT 1
     FROM information_schema.tables
     WHERE table_name = 'posts'
   ) as posts_table_exists;

   -- Should return: true
   ```

### Step 2: Test Connection

Tidak perlu konfigurasi tambahan! Environment variables sudah ada di `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🎨 Features Implemented

### 1. Create Post

**Form Fields:**

- ✅ Title (required)
- ✅ Description (required)
- ✅ Content (TipTap editor, min 100 chars)
- ✅ Cover image (upload to Supabase Storage)
- ✅ Tags (min 2)
- ✅ Meta title, description, keywords
- ✅ Enable comments toggle
- ✅ Publish toggle (draft/published)

**Process:**

1. User fills form
2. Upload cover image → Supabase Storage
3. Generate slug from title
4. Save to database
5. Redirect to post list

### 2. Edit Post

**Features:**

- ✅ Fetch existing post data
- ✅ Pre-fill form
- ✅ Update post
- ✅ Keep existing cover if not changed

### 3. List Posts

**Features:**

- ✅ Fetch user's posts from database
- ✅ Filter by status (All, Published, Draft)
- ✅ Sort by (Latest, Oldest, Popular)
- ✅ Search posts
- ✅ Real-time count badges

### 4. Auto Features

**Triggers:**

- ✅ Auto-update `updated_at` on every update
- ✅ Auto-set `published_at` when status → published
- ✅ Auto-clear `published_at` when status → draft

**Slug Generation:**

- ✅ Auto-generate from title
- ✅ URL-friendly (lowercase, hyphens)
- ✅ Remove special characters

---

## 📁 Files Created/Modified

### Created:

```
✅ supabase_migrations/create_posts_table.sql
✅ src/hooks/use-posts.js
✅ BLOG_DATABASE_INTEGRATION.md
```

### Modified:

```
✅ src/lib/supabase-client.js
   - createPost() - with slug generation
   - updatePost() - with slug update
   - getUserPosts() - fetch user's posts
   - getPostById() - fetch single post
   - generateSlug() - helper function

✅ src/sections/blog/post-new-edit-form.jsx
   - Import useAuthContext, createPost, updatePost, uploadPostImage
   - Update schema (add publish, enableComments)
   - Implement real submit handler
   - Upload cover image
   - Save to database
   - Error handling

✅ src/sections/blog/view/post-list-view.jsx
   - Import usePosts hook
   - Fetch from database
   - Update filter logic (status instead of publish)
   - Update field names (created_at, view_count)
```

---

## 🔧 Technical Details

### Slug Generation

```javascript
generateSlug('Hello World! 123');
// Output: "hello-world-123"

generateSlug('Pendidikan Agile di Pesantren');
// Output: "pendidikan-agile-di-pesantren"
```

**Rules:**

- Lowercase
- Spaces → hyphens
- Remove special characters
- Remove multiple hyphens
- Trim leading/trailing hyphens

### Cover Image Upload

```javascript
// If file object
if (typeof coverUrl !== 'string') {
  coverUrl = await uploadPostImage('covers', file);
}

// Upload to: post-images/covers/filename-timestamp.ext
// Returns: https://...supabase.co/storage/v1/object/public/post-images/...
```

### Status Flow

```
draft → published
  ↓
  published_at = NOW()

published → draft
  ↓
  published_at = NULL
```

---

## 🔐 Security (RLS Policies)

### Posts Table:

1. **SELECT:**

   - ✅ Anyone can view published posts
   - ✅ Users can view their own posts (any status)

2. **INSERT:**

   - ✅ Authenticated users can create posts
   - ✅ Must set author_id = auth.uid()

3. **UPDATE:**

   - ✅ Users can update their own posts only

4. **DELETE:**
   - ✅ Users can delete their own posts only

### Categories Table:

- ✅ Anyone can view categories
- ❌ Only admins can modify (future feature)

---

## 🧪 Testing Guide

### Test Create Post

1. **Login:**

   ```
   http://localhost:3032/auth/supabase/sign-in
   Email: fauzimnoor90@gmail.com
   Password: password123
   ```

2. **Create Post:**

   ```
   http://localhost:3032/dashboard/post/new
   ```

3. **Fill Form:**

   - Title: "Test Artikel Pertama"
   - Description: "Ini adalah artikel test"
   - Content: (min 100 characters)
   - Cover: Upload image
   - Tags: ["test", "artikel"]
   - Meta keywords: ["test"]
   - Publish: ON

4. **Submit:**

   - Should show: "Artikel berhasil dibuat!"
   - Redirect to: `/dashboard/post`
   - Post appears in list

5. **Verify Database:**
   ```sql
   SELECT * FROM posts ORDER BY created_at DESC LIMIT 1;
   ```

### Test Edit Post

1. **Go to Post List:**

   ```
   http://localhost:3032/dashboard/post
   ```

2. **Click Edit on a post**

3. **Modify:**

   - Change title
   - Update content
   - Change status

4. **Submit:**
   - Should show: "Artikel berhasil diupdate!"
   - Changes reflected in list

### Test Filters

1. **Status Filter:**

   - Click "All" → Shows all posts
   - Click "Published" → Shows only published
   - Click "Draft" → Shows only drafts

2. **Sort:**
   - Latest → Newest first
   - Oldest → Oldest first
   - Popular → Most views first

---

## 🐛 Troubleshooting

### Error: "relation 'posts' does not exist"

**Solution:** Run migration SQL

```sql
-- In Supabase SQL Editor
-- Copy & paste: supabase_migrations/create_posts_table.sql
```

### Error: "Failed to upload image"

**Check:**

1. Bucket `post-images` exists
2. RLS policies allow upload
3. File size < 5MB
4. File type is image/\*

### Error: "Failed to create post"

**Check Console:**

```javascript
// Look for detailed error
console.log('Error creating post:', error);
```

**Common Issues:**

- Missing required fields (title, description, content)
- Invalid author_id (not logged in)
- Duplicate slug (title already exists)

### Posts Not Showing in List

**Check:**

1. User is logged in
2. Posts belong to current user
3. No console errors
4. Database has data:
   ```sql
   SELECT * FROM posts WHERE author_id = 'YOUR_USER_ID';
   ```

---

## 📊 Database Indexes

**Performance Optimizations:**

```sql
-- Fast lookup by author
idx_posts_author_id

-- Fast lookup by slug (for public URLs)
idx_posts_slug

-- Fast filter by status
idx_posts_status

-- Fast sort by published date
idx_posts_published_at

-- Fast sort by created date
idx_posts_created_at

-- Fast search by tags
idx_posts_tags (GIN index)
```

---

## 🎯 Next Steps

### Immediate:

1. ✅ Run migration
2. ✅ Test create post
3. ✅ Test edit post
4. ✅ Create first real article

### Future Enhancements:

1. **Categories:**

   - Assign categories to posts
   - Filter by category
   - Category management UI

2. **Comments:**

   - Enable/disable per post
   - Comment moderation
   - Reply to comments

3. **Analytics:**

   - Track view count
   - Popular posts widget
   - Reading time calculation

4. **SEO:**

   - Auto-generate meta description
   - Sitemap generation
   - Social media preview

5. **Media Library:**
   - Browse uploaded images
   - Reuse images in posts
   - Image optimization

---

## 📝 API Reference

### Helper Functions

```javascript
// Create post
const post = await createPost({
  title: 'My Post',
  description: 'Description',
  content: '<p>Content</p>',
  cover_url: 'https://...',
  tags: ['tag1', 'tag2'],
  meta_keywords: ['keyword1'],
  status: 'published',
  enable_comments: true,
  author_id: user.id,
});

// Update post
const updated = await updatePost(postId, {
  title: 'Updated Title',
  status: 'draft',
});

// Get user's posts
const posts = await getUserPosts(userId);

// Get post by ID
const post = await getPostById(postId);

// Delete post
await deletePost(postId);

// Generate slug
const slug = generateSlug('My Post Title');
// Returns: 'my-post-title'
```

---

## ✅ Checklist

**Before Testing:**

- [ ] Run migration SQL
- [ ] Verify table exists
- [ ] Check RLS policies
- [ ] Verify categories inserted

**Testing:**

- [ ] Create draft post
- [ ] Create published post
- [ ] Edit post
- [ ] Upload cover image
- [ ] Filter by status
- [ ] Sort posts
- [ ] Delete post

**Production:**

- [ ] Backup database
- [ ] Test on staging
- [ ] Monitor errors
- [ ] Check performance

---

**Created:** 2025-12-06
**Version:** 1.0.0
**Author:** Kiro AI Assistant
