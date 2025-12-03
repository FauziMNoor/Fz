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

- Change password
- Email preferences
- Notification settings
- Billing & plans (jika diperlukan)

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

- ✅ `profiles` - User profiles dengan role (admin/user)
- ✅ `posts` - Blog articles dengan status (draft/published/archived)
- ✅ `categories` - Kategori artikel (Pendidikan, Agile, Kepemimpinan, Pesantren)
- ✅ `tags` - Tags untuk artikel
- ✅ `post_categories` - Many-to-many relationship
- ✅ `post_tags` - Many-to-many relationship
- ✅ `comments` - Komentar dengan nested support

**Features:**

- ✅ Row Level Security (RLS) policies
- ✅ Auto-update timestamps dengan triggers
- ✅ Auto-create profile saat user register
- ✅ Performance indexes

### Supabase Helper Functions

File: `src/lib/supabase-client.js`

```javascript
// Get published posts
const posts = await getPublishedPosts();

// Get post by slug
const post = await getPostBySlug('my-article');

// Create new post
const newPost = await createPost({
  title: 'Judul Artikel',
  slug: 'judul-artikel',
  content: 'Isi artikel...',
  author_id: user.id,
  status: 'draft',
});

// Get categories & tags
const categories = await getCategories();
const tags = await getTags();
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
- [x] Buat database schema lengkap
- [x] Integrasi Supabase dengan aplikasi
- [x] Buat user admin pertama
- [x] Kustomisasi home page hero
- [x] Setup dashboard dengan statistik
- [x] Implementasi post management (CRUD)
- [x] Rich text editor untuk blog
- [x] File manager untuk media

### 🔲 Belum Selesai

1. [ ] **Content:**

   - [ ] Buat konten blog pertama
   - [ ] Upload foto profil & avatar
   - [ ] Sesuaikan FAQs dengan konten relevan
   - [ ] Tambah bio & informasi di About page

2. [ ] **Integration:**

   - [ ] Connect blog posts dengan Supabase (saat ini masih mock data)
   - [ ] Implementasi comment system
   - [ ] Setup Storage untuk upload gambar
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
**Version:** 1.1.0
**Author:** Fauzi M. Noor
