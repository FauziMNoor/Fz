# 🚀 Supabase Setup - Blog Fauzi M. Noor

## ✅ Status Implementasi

### Database Schema
- ✅ **profiles** - User profiles dengan role (admin/user)
- ✅ **posts** - Blog articles dengan status (draft/published/archived)
- ✅ **categories** - Kategori artikel (Pendidikan, Agile, Kepemimpinan, Pesantren)
- ✅ **tags** - Tags untuk artikel
- ✅ **post_categories** - Many-to-many relationship
- ✅ **post_tags** - Many-to-many relationship
- ✅ **comments** - Komentar dengan nested support
- ✅ **Row Level Security (RLS)** - Keamanan data otomatis
- ✅ **Triggers** - Auto update timestamps & create profile
- ✅ **Indexes** - Performance optimization

### Authentication
- ✅ Auth method diubah ke `supabase`
- ✅ Sign-in button redirect ke Supabase
- ✅ Environment variables configured
- ✅ Supabase client helper functions

---

## 📋 Langkah Selanjutnya

### 1. Buat User Admin di Supabase

1. Buka Supabase Dashboard: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
2. Klik **Authentication** → **Users**
3. Klik **Add User** → **Create new user**
4. Isi:
   - Email: `fauzimnoor90@gmail.com`
   - Password: (buat password yang kuat)
   - Auto Confirm User: ✅ **CENTANG INI**
5. Klik **Create User**

### 2. Set User sebagai Admin

Setelah user dibuat, jalankan SQL ini di **SQL Editor**:

```sql
-- Update user role menjadi admin
UPDATE profiles 
SET role = 'admin',
    full_name = 'Fauzi M. Noor',
    bio = 'Agile Principal & Educator'
WHERE email = 'fauzimnoor90@gmail.com';
```

### 3. Test Login

1. Buka: http://localhost:3032
2. Klik tombol **"Sign in"** di header
3. Akan redirect ke: http://localhost:3032/auth/supabase/sign-in
4. Login dengan:
   - Email: `fauzimnoor90@gmail.com`
   - Password: (password yang Anda buat)
5. Setelah login, akan redirect ke dashboard

---

## 🗄️ Database Schema Detail

### **profiles**
```sql
id          UUID PRIMARY KEY (references auth.users)
email       TEXT UNIQUE NOT NULL
full_name   TEXT
avatar_url  TEXT
bio         TEXT
role        TEXT ('admin' | 'user')
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### **posts**
```sql
id            UUID PRIMARY KEY
title         TEXT NOT NULL
slug          TEXT UNIQUE NOT NULL
content       TEXT
excerpt       TEXT
cover_image   TEXT
author_id     UUID (references profiles)
status        TEXT ('draft' | 'published' | 'archived')
published_at  TIMESTAMP
views         INTEGER
reading_time  INTEGER (dalam menit)
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

### **categories**
```sql
id          UUID PRIMARY KEY
name        TEXT UNIQUE NOT NULL
slug        TEXT UNIQUE NOT NULL
description TEXT
created_at  TIMESTAMP
```

**Data yang sudah ada:**
- Pendidikan
- Agile
- Kepemimpinan
- Pesantren

### **tags**
```sql
id          UUID PRIMARY KEY
name        TEXT UNIQUE NOT NULL
slug        TEXT UNIQUE NOT NULL
created_at  TIMESTAMP
```

**Data yang sudah ada:**
- Agile Education
- Leadership
- Innovation
- Digital Transformation
- Student Engagement
- Scrum
- Kanban
- Transformasi Digital

### **comments**
```sql
id         UUID PRIMARY KEY
post_id    UUID (references posts)
author_id  UUID (references profiles)
content    TEXT NOT NULL
parent_id  UUID (references comments) -- untuk nested comments
status     TEXT ('pending' | 'approved' | 'spam')
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## 🔐 Row Level Security (RLS) Policies

### Posts
- ✅ Semua orang bisa lihat post yang **published**
- ✅ Author bisa lihat post **draft** miliknya sendiri
- ✅ Author bisa create, update, delete post miliknya

### Comments
- ✅ Semua orang bisa lihat comment yang **approved**
- ✅ Author bisa lihat comment miliknya (meski pending)
- ✅ User yang login bisa create comment

### Profiles
- ✅ Semua orang bisa lihat profile
- ✅ User hanya bisa update profile sendiri

---

## 📁 File yang Dibuat/Diubah

### Dibuat:
- ✅ `src/lib/supabase-client.js` - Helper functions untuk Supabase
- ✅ `SUPABASE_SETUP.md` - Dokumentasi ini

### Diubah:
- ✅ `.env` - Supabase credentials
- ✅ `src/global-config.js` - Auth method → `supabase`
- ✅ `src/layouts/components/sign-in-button.jsx` - Dynamic auth routing

---

## 🎯 Cara Menggunakan Supabase Client

### Import
```javascript
import { supabase, getPublishedPosts, getPostBySlug } from 'src/lib/supabase-client';
```

### Get All Published Posts
```javascript
const posts = await getPublishedPosts();
```

### Get Post by Slug
```javascript
const post = await getPostBySlug('my-first-post');
```

### Create New Post
```javascript
const newPost = await createPost({
  title: 'Judul Artikel',
  slug: 'judul-artikel',
  content: 'Isi artikel...',
  excerpt: 'Ringkasan...',
  author_id: user.id,
  status: 'draft'
});
```

### Get Categories
```javascript
const categories = await getCategories();
```

### Get Tags
```javascript
const tags = await getTags();
```

---

## 🔗 Links Penting

- **Supabase Dashboard**: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
- **Database**: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor
- **Authentication**: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/auth/users
- **Storage**: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/storage/buckets
- **SQL Editor**: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql

---

## 📝 Next Steps untuk Development

1. ✅ Buat user admin (lihat langkah di atas)
2. 🔲 Buat halaman dashboard untuk manage posts
3. 🔲 Buat form create/edit post
4. 🔲 Buat halaman blog list
5. 🔲 Buat halaman blog detail
6. 🔲 Implementasi comment system
7. 🔲 Setup Storage untuk upload gambar

---

**Project**: fauzi_blog  
**Region**: Singapore (ap-southeast-1)  
**Status**: ✅ Ready to use!

