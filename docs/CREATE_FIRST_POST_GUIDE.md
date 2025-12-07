# 📝 Create Your First Blog Post - Complete Guide

## 🎯 Prerequisites

Before creating a post, make sure:

1. ✅ Migration sudah di-run (`CLEAN_AND_CREATE_POSTS.sql`)
2. ✅ Dev server running (`npm run dev`)
3. ✅ Sudah login sebagai admin

---

## 🚀 Step-by-Step: Create First Post

### Step 1: Go to Create Page

```
http://localhost:3032/dashboard/post/new
```

### Step 2: Fill Required Fields

#### **1. Title** (Required)

```
Example: "Pendidikan Agile di Era Digital"
```

- Auto-generates slug: `pendidikan-agile-di-era-digital`

#### **2. Description** (Required)

```
Example: "Bagaimana prinsip Agile dapat diterapkan dalam dunia pendidikan modern untuk meningkatkan kualitas pembelajaran."
```

- Short summary (1-2 sentences)

#### **3. Content** (Required, min 100 chars)

```
Example:
Pendidikan di era digital membutuhkan pendekatan yang lebih fleksibel dan adaptif.
Prinsip Agile yang selama ini digunakan dalam pengembangan software ternyata
sangat relevan untuk diterapkan di dunia pendidikan.

Dengan Agile, kita bisa:
- Merespons perubahan dengan cepat
- Fokus pada kebutuhan siswa
- Iterasi dan perbaikan berkelanjutan
- Kolaborasi yang lebih baik
```

#### **4. Cover Image** (Required)

- Click upload area
- Select image (max 5MB)
- Preview will show
- Image uploads to Supabase Storage

#### **5. Tags** (Required, min 2)

```
Example: ["pendidikan", "agile"]
```

- Type and press Enter
- Add at least 2 tags

#### **6. Meta Keywords** (Required, min 1)

```
Example: ["pendidikan agile", "pembelajaran modern"]
```

- For SEO purposes

### Step 3: Optional Fields

#### **Meta Title** (Optional)

```
Example: "Pendidikan Agile di Era Digital | Fauzi M. Noor"
```

- If empty, uses post title

#### **Meta Description** (Optional)

```
Example: "Pelajari bagaimana prinsip Agile dapat meningkatkan kualitas pendidikan di era digital."
```

- If empty, uses post description

#### **Enable Comments** (Toggle)

- ON = Allow comments
- OFF = Disable comments

#### **Publish** (Toggle)

- ON = Published (visible to public)
- OFF = Draft (only visible to you)

### Step 4: Preview (Optional)

Click **"Preview"** button to see how post will look.

### Step 5: Submit

Click **"Create post"** button.

**Expected:**

- ✅ Toast: "Artikel berhasil dibuat!"
- ✅ Redirect to `/dashboard/post`
- ✅ Post appears in list

---

## 📊 What Happens Behind the Scenes

### 1. Cover Image Upload

```javascript
// Upload to Supabase Storage
uploadPostImage('covers', file);
// Returns: https://...supabase.co/.../covers/image-123.jpg
```

### 2. Slug Generation

```javascript
generateSlug('Pendidikan Agile di Era Digital');
// Returns: "pendidikan-agile-di-era-digital"
```

### 3. Database Insert

```javascript
{
  title: "Pendidikan Agile di Era Digital",
  slug: "pendidikan-agile-di-era-digital",
  description: "...",
  content: "<p>...</p>",
  cover_url: "https://...",
  tags: ["pendidikan", "agile"],
  meta_keywords: ["pendidikan agile"],
  status: "published", // or "draft"
  enable_comments: true,
  author_id: "bb2e61da-8f0c-4f12-9fef-59f82db50d69"
}
```

### 4. Auto-Set Fields

```javascript
{
  id: "uuid-generated",
  slug: "auto-generated-from-title",
  created_at: "NOW()",
  updated_at: "NOW()",
  published_at: "NOW()" // if status = published
}
```

---

## 🔍 View Your Post

### In Dashboard List

```
http://localhost:3032/dashboard/post
```

- Shows all your posts
- Filter by status (All, Published, Draft)
- Sort by date/popularity

### Post Detail Page

```
http://localhost:3032/dashboard/post/[slug]
```

Example:

```
http://localhost:3032/dashboard/post/pendidikan-agile-di-era-digital
```

### Edit Post

```
http://localhost:3032/dashboard/post/[slug]/edit
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Post not found" after creating

**Cause:** Slug mismatch or post not saved

**Solution:**

1. Check database:
   ```sql
   SELECT id, title, slug, status FROM posts ORDER BY created_at DESC LIMIT 5;
   ```
2. Use exact slug from database in URL

### Issue 2: Cover image not uploading

**Cause:** File too large or wrong format

**Solution:**

- Max size: 5MB
- Formats: JPG, PNG, GIF, WebP
- Check console for errors

### Issue 3: "Title is required" error

**Cause:** Empty required fields

**Solution:**

- Fill all required fields:
  - Title ✅
  - Description ✅
  - Content (min 100 chars) ✅
  - Cover image ✅
  - Tags (min 2) ✅
  - Meta keywords (min 1) ✅

### Issue 4: Post not appearing in list

**Cause:** Wrong status filter

**Solution:**

- If post is draft, click "Draft" tab
- If post is published, click "Published" tab
- Check "All" tab to see all posts

### Issue 5: Slug already exists

**Cause:** Duplicate title

**Solution:**

- Change title slightly
- Or manually edit slug in database

---

## 📝 Example Post Data

### Minimal Example

```javascript
{
  title: "Test Post",
  description: "This is a test post",
  content: "<p>This is the content of my test post. It needs to be at least 100 characters long to meet the minimum requirement.</p>",
  coverUrl: File, // Upload image
  tags: ["test", "demo"],
  metaKeywords: ["test"],
  publish: true,
  enableComments: true
}
```

### Full Example

```javascript
{
  title: "Pendidikan Agile di Era Digital",
  description: "Bagaimana prinsip Agile dapat diterapkan dalam dunia pendidikan modern.",
  content: "<p>Pendidikan di era digital membutuhkan pendekatan yang lebih fleksibel...</p>",
  coverUrl: File,
  tags: ["pendidikan", "agile", "digital"],
  metaKeywords: ["pendidikan agile", "pembelajaran modern", "digital learning"],
  metaTitle: "Pendidikan Agile di Era Digital | Fauzi M. Noor",
  metaDescription: "Pelajari bagaimana prinsip Agile dapat meningkatkan kualitas pendidikan.",
  publish: true,
  enableComments: true
}
```

---

## ✅ Verification Checklist

After creating post:

- [ ] Post appears in `/dashboard/post` list
- [ ] Can click post to view detail
- [ ] Can click edit to modify
- [ ] Cover image displays correctly
- [ ] Tags show correctly
- [ ] Status badge shows (Published/Draft)
- [ ] Date displays correctly

---

## 🎯 Next Steps

After creating first post:

1. **Create more posts** - Build your content library
2. **Test edit** - Modify existing post
3. **Test draft** - Create draft post
4. **Test filters** - Filter by status
5. **Test search** - Search posts by title

---

## 📚 Related Documentation

- `BLOG_DATABASE_INTEGRATION.md` - Technical details
- `EDITOR_IMAGE_VIDEO_GUIDE.md` - Editor features
- `RUN_THIS_CLEAN_MIGRATION.md` - Database setup

---

**Ready to create your first post? Go to:**

```
http://localhost:3032/dashboard/post/new
```

🚀 Happy blogging!
