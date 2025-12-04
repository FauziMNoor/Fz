# 🚀 MULAI DARI SINI - Dokumentasi Aplikasi

## 📋 Ringkasan Aplikasi

Ini adalah **Personal Blog & Portfolio Website** untuk **Fauzi M. Noor** (Kepala Sekolah & Pendidik Agile). Aplikasi dibangun menggunakan template **Minimal UI v7.0.0** dengan **Next.js 15** dan **Material UI v7**.

**Status Terkini:** ✅ Supabase Authentication & Database sudah terintegrasi penuh!

---

## 🏗️ Struktur Proyek

```
src/
├── app/                    # Next.js App Router (Pages)
│   ├── (home)/            # Landing page utama
│   ├── tentang-saya/      # Halaman About (Profile publik)
│   ├── post/              # Blog posts (public)
│   │   ├── page.jsx       # Daftar semua artikel
│   │   └── [title]/       # Detail artikel (dynamic route)
│   ├── dashboard/         # Admin panel untuk mengelola blog
│   │   ├── page.jsx       # Dashboard overview dengan statistik
│   │   ├── post/          # Manajemen artikel
│   │   │   ├── page.jsx   # List semua post
│   │   │   ├── new/       # Buat post baru
│   │   │   └── [title]/   # Detail & edit post
│   │   ├── file-manager/  # Media library
│   │   └── user/          # Profile & account settings
│   ├── auth/              # Autentikasi (Supabase, JWT, Firebase, dll)
│   │   └── supabase/      # Supabase auth pages
│   └── error/             # Error pages (403, 404, 500)
│
├── sections/              # Komponen UI per halaman
│   ├── home/              # Hero, FAQs, Integrations, Advertisement
│   ├── about/             # About page sections
│   ├── blog/              # Blog post components (form, list, detail)
│   ├── overview/          # Dashboard overview widgets
│   ├── file-manager/      # File management components
│   └── user/              # User profile components
│
├── layouts/               # Layout templates
│   ├── main/              # Layout untuk public pages
│   ├── dashboard/         # Layout untuk admin panel
│   ├── auth-centered/     # Layout untuk auth pages
│   └── simple/            # Layout minimal
│
├── components/            # Reusable UI components
│   ├── animate/           # Framer Motion animations
│   ├── carousel/          # Slider components
│   ├── editor/            # TipTap rich text editor
│   ├── upload/            # File upload components
│   └── ...
│
├── auth/                  # Authentication logic
│   ├── context/           # Auth providers (Supabase, JWT, Firebase, dll)
│   ├── guard/             # Route protection
│   └── view/              # Auth UI components
│
├── lib/                   # Library integrations
│   ├── supabase-client.js # Supabase helper functions
│   └── axios.js           # HTTP client
│
├── actions/               # Server actions
│   └── blog-ssr.js        # Blog data fetching (SSR)
│
├── theme/                 # MUI Theme configuration
├── routes/                # Route paths definition
└── utils/                 # Utility functions
```

---

## 🎨 Skema Warna (Color Palette)

### Primary Color (Override - Ungu)

```javascript
primary: {
  lighter: '#E4DCFD',
  light: '#A996F8',
  main: '#6950E8',      // ⭐ Warna utama (Ungu)
  dark: '#3828A7',
  darker: '#180F6F',
  contrastText: '#FFFFFF'
}
```

### Default Palette (dari theme-config.js)

| Color     | Main      | Deskripsi       |
| --------- | --------- | --------------- |
| Primary   | `#00A76F` | Hijau (Default) |
| Secondary | `#8E33FF` | Ungu            |
| Info      | `#00B8D9` | Cyan            |
| Success   | `#22C55E` | Hijau muda      |
| Warning   | `#FFAB00` | Kuning oranye   |
| Error     | `#FF5630` | Merah           |

### Background Colors

- **Light Mode**: `#FFFFFF` (paper & default)
- **Dark Mode**: `grey[800]` (paper), `grey[900]` (default)

---

## 🔐 Sistem Autentikasi

**Provider Aktif:** ✅ **Supabase** (sudah dikonfigurasi & berjalan)

Mendukung 5 provider autentikasi:

1. **Supabase** ⭐ (AKTIF) - `src/auth/context/supabase`
2. **JWT** - `src/auth/context/jwt`
3. **Firebase** - `src/auth/context/firebase`
4. **Auth0** - `src/auth/context/auth0`
5. **AWS Amplify** - `src/auth/context/amplify`

Konfigurasi di `src/global-config.js`:

```javascript
auth: {
  method: 'supabase',  // ✅ Sudah diset ke Supabase
  skip: false,
  redirectPath: paths.dashboard.root
}
```

### Kredensial Login Admin

- **Email:** `fauzimnoor90@gmail.com`
- **Password:** `password123`
- **Role:** `admin`
- **User ID:** `bb2e61da-8f0c-4f12-9fef-59f82db50d69`

### Supabase Configuration

File `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://nvppnowugnjfvquvibqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Dokumentasi lengkap:** Lihat `SUPABASE_SETUP.md`

---

## 📍 Halaman Utama (Routes)

### Public Pages

| Path            | Deskripsi                             | Status |
| --------------- | ------------------------------------- | ------ |
| `/`             | Home - Landing page dengan Hero, FAQs | ✅     |
| `/tentang-saya` | About page - Profile publik           | ✅     |
| `/post`         | Daftar semua blog posts               | ✅     |
| `/post/[title]` | Detail blog post (dynamic)            | ✅     |

### Authentication Pages

| Path                     | Deskripsi          | Status |
| ------------------------ | ------------------ | ------ |
| `/auth/supabase/sign-in` | Login page         | ✅     |
| `/auth/supabase/sign-up` | Register page      | ✅     |
| `/auth/supabase/verify`  | Email verification | ✅     |

### Dashboard (Protected - Requires Login)

| Path                           | Deskripsi                                | Status |
| ------------------------------ | ---------------------------------------- | ------ |
| `/dashboard`                   | Dashboard overview dengan statistik blog | ✅     |
| `/dashboard/post`              | List semua posts (draft & published)     | ✅     |
| `/dashboard/post/new`          | Buat post baru dengan rich editor        | ✅     |
| `/dashboard/post/[title]`      | Detail post (preview)                    | ✅     |
| `/dashboard/post/[title]/edit` | Edit post                                | ✅     |
| `/dashboard/file-manager`      | Media library untuk manage files         | ✅     |
| `/dashboard/user`              | Profile penulis (public view)            | ✅     |
| `/dashboard/user/account`      | Account settings (password, preferences) | ✅     |

### Error Pages

| Path         | Deskripsi    |
| ------------ | ------------ |
| `/error/403` | Forbidden    |
| `/error/404` | Not Found    |
| `/error/500` | Server Error |

---

## ⚙️ Fitur Dashboard (Admin)

### 1. 📊 Dashboard Overview

- **Statistik Blog:**
  - Total Posts (dengan trend chart)
  - Total Views (dengan trend chart)
  - Total Comments (dengan trend chart)
  - Posts by Category (pie chart)
  - Avg. Read Time
  - Published This Month
- **Featured Posts Carousel**
- **Quick Actions:** Button "Write New Post"

### 2. 📝 Posts Management

- **List View:**
  - Filter by status (All, Published, Draft)
  - Search posts
  - Sort by (Latest, Oldest, Popular)
  - Horizontal card layout dengan preview
- **Create/Edit Post:**
  - Rich text editor (TipTap) dengan formatting
  - Cover image upload
  - Tags & categories
  - Meta SEO (title, description, keywords)
  - Preview mode sebelum publish
  - Publish/Draft toggle

### 3. 📁 Media Library (File Manager)

- Upload & organize files
- Grid/List view
- File details panel
- Storage overview
- Share files

### 4. 👤 My Profile

- Public author profile view
- Profile tabs: Home, Followers, Friends, Gallery
- Edit profile information

### 5. ⚙️ Account Settings

**Status:** ✅ **Terintegrasi penuh dengan Supabase Database!**

4 Tab yang tersedia:

1. **General** - Profile information

   - Full name, email, phone number
   - Country, address, state, city, zip code
   - Avatar upload (Supabase Storage)
   - Bio/about text
   - Public profile toggle

2. **Notifications** - Email notification preferences

   - Activity notifications (comments, answers, follows)
   - Application notifications (news, updates, blog digest)
   - Tersimpan sebagai JSONB di database

3. **Social Links** - Social media URLs

   - Facebook, Instagram, Threads, YouTube
   - Menggunakan custom icon dari `public/assets/icons/socialmedia/`
   - Tersimpan di kolom terpisah di database

4. **Security** - Change password
   - Menggunakan Supabase Auth API
   - Validasi old password, new password, confirm password

**Dokumentasi lengkap:** Lihat `ACCOUNT_SETTINGS_INTEGRATION.md`

### 6. 🎨 UI Customizations

**Dashboard Layout:**

- ✅ Hapus workspace dropdown (tidak relevan untuk blog personal)
- ✅ Hapus "Upgrade to Pro" section
- ✅ Profile photo di header & sidebar menggunakan data dari database
- ✅ Badge "Admin" di sidebar untuk user dengan role admin

**Account Drawer Menu:**

- ✅ Home - Link ke homepage
- ✅ Profile - Link ke halaman profile publik
- ✅ Security - Link ke change password
- ✅ Account settings - Link ke account settings
- ❌ Projects & Subscription - Dihapus (tidak relevan)

**Social Media Icons:**

- ✅ Custom SVG icons dari `public/assets/icons/socialmedia/`
- ✅ Mendukung: Facebook, Instagram, Threads, YouTube, Twitter, Telegram, WhatsApp

**Bahasa:**

- ✅ Halaman Notifications menggunakan Bahasa Indonesia
- ✅ Toast messages dalam Bahasa Indonesia

---

## 🎬 Animasi & UI

- **Framer Motion** - Animasi scroll, parallax, fade
- **Embla Carousel** - Slider/carousel
- **TipTap Editor** - Rich text editor untuk blog
- **ApexCharts** - Chart/grafik
- **React Lightbox** - Galeri gambar

---

## 🌐 Internationalization (i18n)

Mendukung multi-bahasa dengan `i18next`:

- Konfigurasi: `src/locales/`
- Server-side detection
- Browser language detection

---

## 📝 Konten Yang Sudah Dikustomisasi

### 🏠 Home Page (`src/app/(home)/page.jsx`)

**Metadata:**

- Title: "Fauzi M. Noor"
- Description: "Pendidik Visioner Dengan Prinsip Agile"

**Sections:**

1. **Hero Section** (`src/sections/home/home-hero.jsx`)

   - Heading: "Pendidik Visioner Dengan Prinsip **Agile**"
   - Deskripsi: _"Saya Fauzi M. Noor, Kepala Sekolah & pembelajar sepanjang hayat. Saya menulis tentang pendidikan, Agile, dan pengalaman membangun perubahan di dunia pesantren."_
   - Buttons:
     - "Tentang Saya" → `/tentang-saya`
     - "Baca Tulisan Terbaru" → `/post`
   - Social Media Icons: Facebook, Instagram, Threads, WhatsApp, Telegram
   - Parallax scroll effects dengan Framer Motion

2. **Integrations Section** (`src/sections/home/home-integrations.jsx`)

   - Showcase teknologi & tools yang digunakan

3. **FAQs Section** (`src/sections/home/home-faqs.jsx`)

   - CTA: "Punya ide atau pertanyaan??"
   - Sub-text: "Ayo ngobrol sebentar ☕"

4. **Advertisement Section** (`src/sections/home/home-advertisement.jsx`)
   - Call-to-action untuk explore lebih lanjut

### 👤 About Page (`src/app/tentang-saya/page.jsx`)

- Profile cover dengan avatar
- Tabs: Home, Followers, Friends, Gallery
- Public profile view

### 📊 Dashboard Overview (`src/sections/overview/app/view/overview-app-view.jsx`)

- Welcome message dengan nama user
- Blog statistics widgets
- Featured posts carousel
- Quick action: "Write New Post"

---

## 🛠️ Scripts NPM

```bash
yarn dev          # Jalankan development server (port 3032)
yarn build        # Build production
yarn start        # Jalankan production server
yarn lint         # Cek ESLint
yarn fm:fix       # Format dengan Prettier
```

---

## 📦 Dependencies Utama

- **Next.js 15** - React framework
- **MUI v7** - Material UI components
- **Framer Motion** - Animasi
- **Supabase** - Backend/Auth option
- **TipTap** - Rich text editor
- **SWR** - Data fetching
- **Zod** - Schema validation
- **React Hook Form** - Form handling

---

## �️ Database & Backend (Supabase)

### Database Schema

Lihat detail lengkap di `SUPABASE_SETUP.md`

**Tables:**

- ✅ `profiles` - User profiles dengan role (admin/user) - **20 kolom**
  - Basic info: id, email, full_name, avatar_url, bio, role
  - Contact: phone_number, country, address, state, city, zip_code
  - Social: social_facebook, social_instagram, social_threads, social_youtube
  - Settings: is_public, notification_preferences (JSONB)
  - Timestamps: created_at, updated_at
- ✅ `posts` - Blog articles dengan status (draft/published/archived)
- ✅ `categories` - Kategori artikel (Pendidikan, Agile, Kepemimpinan, Pesantren)
- ✅ `tags` - Tags untuk artikel
- ✅ `post_categories` - Many-to-many relationship
- ✅ `post_tags` - Many-to-many relationship
- ✅ `comments` - Komentar dengan nested support

**Storage Buckets:**

- ✅ `avatars` - User profile pictures (public)
- ✅ `post-images` - Blog post images (public)

**Features:**

- ✅ Row Level Security (RLS) policies
- ✅ Auto-update timestamps dengan triggers
- ✅ Auto-create profile saat user register
- ✅ Performance indexes
- ✅ Storage policies untuk upload/download files

### Supabase Helper Functions

File: `src/lib/supabase-client.js`

**Posts Management:**

```javascript
const posts = await getPublishedPosts();
const post = await getPostBySlug('my-article');
const newPost = await createPost({ title, slug, content, author_id, status });
const categories = await getCategories();
const tags = await getTags();
```

**Profile Management:**

```javascript
const profile = await getUserProfile(userId);
const updated = await updateUserProfile(userId, profileData);
```

**Social Links:**

```javascript
await updateSocialLinks(userId, { facebook, instagram, threads, youtube });
```

**Notifications:**

```javascript
await updateNotificationPreferences(userId, preferences);
```

**Storage:**

```javascript
const avatarUrl = await uploadAvatar(userId, file);
await deleteAvatar(userId);
const imageUrl = await uploadPostImage(postId, file);
```

**Password:**

```javascript
await changePassword(newPassword);
```

---

## 🚀 Deployment & Production

### Environment Variables

Pastikan semua environment variables sudah diset:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nvppnowugnjfvquvibqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server URL (optional)
NEXT_PUBLIC_SERVER_URL=https://api-dev-minimal-v700.pages.dev
```

### Build & Deploy

```bash
# Build production
yarn build

# Start production server
yarn start

# Deploy ke Vercel (recommended)
vercel --prod
```

---

## 🔜 TODO / Langkah Selanjutnya

### ✅ Sudah Selesai

- [x] Setup Supabase authentication
- [x] Buat database schema lengkap (20 kolom di tabel profiles)
- [x] Integrasi Supabase dengan aplikasi
- [x] Buat user admin pertama
- [x] Kustomisasi home page hero
- [x] Setup dashboard dengan statistik
- [x] Implementasi post management (CRUD)
- [x] Rich text editor untuk blog
- [x] File manager untuk media
- [x] **Account Settings - General tab** (profile info + avatar upload)
- [x] **Account Settings - Social Links tab** (Facebook, Instagram, Threads, YouTube)
- [x] **Account Settings - Notifications tab** (email preferences dalam Bahasa Indonesia)
- [x] **Account Settings - Security tab** (change password)
- [x] Setup Supabase Storage buckets (avatars, post-images)
- [x] Helper functions untuk profile, social, notifications, storage, password
- [x] Custom social media icons dari `public/assets/icons/socialmedia/`
- [x] Cleanup dashboard layout (hapus workspace dropdown, upgrade to pro)
- [x] Cleanup account drawer menu (hapus Projects & Subscription)

### 🔲 Belum Selesai

1. [ ] **Content:**

   - [ ] Buat konten blog pertama
   - [ ] Upload foto profil & avatar
   - [ ] Sesuaikan FAQs dengan konten relevan
   - [ ] Tambah bio & informasi di About page

2. [ ] **Integration:**

   - [ ] Connect blog posts dengan Supabase (saat ini masih mock data)
   - [ ] Implementasi comment system
   - [x] ~~Setup Storage untuk upload gambar~~ ✅ Sudah selesai (avatars, post-images)
   - [ ] Implementasi search functionality

3. [ ] **SEO & Analytics:**

   - [ ] Kustomisasi SEO metadata per halaman
   - [ ] Setup Google Analytics
   - [ ] Implementasi sitemap.xml
   - [ ] Setup robots.txt

4. [ ] **Production:**
   - [ ] Deploy ke Vercel/Netlify
   - [ ] Setup custom domain
   - [ ] Configure CDN untuk assets
   - [ ] Setup monitoring & error tracking

---

## 📚 Resources & Links

### Documentation

- **Aplikasi:** `mulai_dari_sini.md` (file ini)
- **Supabase Setup:** `SUPABASE_SETUP.md`
- **Account Settings Integration:** `ACCOUNT_SETTINGS_INTEGRATION.md`
- **Storage Setup:** `SUPABASE_STORAGE_SETUP.md`
- **Profile Integration:** `UPDATE_PROFILE_INTEGRATION.md`
- **Next.js Docs:** https://nextjs.org/docs
- **MUI Docs:** https://mui.com/material-ui/
- **Minimal UI Docs:** https://docs.minimals.cc/

### Supabase Dashboard

- **Project:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
- **Database:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor
- **Auth Users:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/auth/users
- **Storage:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/storage/buckets

### Development

- **Local:** http://localhost:3032
- **Login:** http://localhost:3032/auth/supabase/sign-in
- **Dashboard:** http://localhost:3032/dashboard

---

_Dokumentasi ini dibuat sebagai panduan untuk memahami dan mengembangkan aplikasi._

**Last Updated:** 2025-12-03
**Version:** 1.3.0
**Author:** Fauzi M. Noor

---

## 📝 Changelog

### Version 1.3.0 (2025-12-03)

**✅ UI/UX Improvements & Social Media Update**

- ✅ Update social media links: LinkedIn & Twitter → Threads & YouTube
- ✅ Implementasi custom social media icons dari `public/assets/icons/socialmedia/`
- ✅ Komponen baru: `SocialIcon` untuk render SVG icons
- ✅ Database migration: Update kolom social_linkedin & social_twitter → social_threads & social_youtube
- ✅ Terjemahkan halaman Notifications ke Bahasa Indonesia
- ✅ Cleanup dashboard layout:
  - Hapus workspace dropdown ("Team 1, Team 2, Team 3")
  - Hapus "Upgrade to Pro" section
  - Hapus "Switch to" avatars
- ✅ Cleanup account drawer menu:
  - Hapus menu "Projects" (dengan badge "3")
  - Hapus menu "Subscription"
  - Pertahankan: Home, Profile, Security, Account Settings
- ✅ Fix profile photo display di header & sidebar (menggunakan data dari database)
- ✅ Update `AuthProvider` untuk fetch profile data dari database

**Files Modified:**

- `src/components/social-icon.jsx` (NEW)
- `src/sections/account/account-socials.jsx`
- `src/sections/account/account-notifications.jsx`
- `src/sections/account/view/account-socials-view.jsx`
- `src/lib/supabase-client.js`
- `src/auth/context/supabase/auth-provider.jsx`
- `src/layouts/nav-config-account.jsx`
- `src/layouts/components/account-drawer.jsx`
- `src/layouts/components/nav-upgrade.jsx`
- `src/layouts/dashboard/layout.jsx`
- `supabase_migrations/update_social_links.sql` (NEW)

### Version 1.2.0 (2025-12-03)

**✅ Account Settings - Full Database Integration**

- ✅ Menambahkan 12 kolom baru ke tabel `profiles` (total 20 kolom)
- ✅ Integrasi General tab dengan database (profile info + avatar upload)
- ✅ Integrasi Social Links tab dengan database (4 social media)
- ✅ Integrasi Notifications tab dengan database (JSONB preferences)
- ✅ Integrasi Security tab dengan Supabase Auth (change password)
- ✅ Setup Supabase Storage buckets (avatars, post-images)
- ✅ Menambahkan 9 helper functions baru di `supabase-client.js`
- ✅ Enhanced error handling dengan detailed logging
- ✅ Dokumentasi lengkap: `ACCOUNT_SETTINGS_INTEGRATION.md`, `SUPABASE_STORAGE_SETUP.md`

### Version 1.1.0 (2025-12-03)

- ✅ Setup Supabase authentication
- ✅ Buat database schema lengkap
- ✅ Integrasi Supabase dengan aplikasi
- ✅ Buat user admin pertama
- ✅ Kustomisasi home page hero
