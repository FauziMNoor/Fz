# 🚀 MULAI DARI SINI - Dokumentasi Aplikasi

## 📋 Ringkasan Aplikasi

Ini adalah **Personal Blog & Portfolio Website** untuk **Fauzi M. Noor** (Kepala Sekolah & Pendidik Agile). Aplikasi dibangun menggunakan template **Minimal UI v7.0.0** dengan **Next.js 15** dan **Material UI v7**.

---

## 🏗️ Struktur Proyek

```
src/
├── app/                    # Next.js App Router (Pages)
│   ├── (home)/            # Landing page utama
│   ├── tentang-saya/      # Halaman About
│   ├── post/              # Blog posts (public)
│   ├── dashboard/         # Admin panel untuk mengelola blog
│   ├── auth/              # Autentikasi (JWT, Supabase, Firebase, dll)
│   └── error/             # Error pages (403, 404, 500)
│
├── sections/              # Komponen UI per halaman
│   ├── home/              # Hero, FAQs, Integrations, Advertisement
│   ├── about/             # About page sections
│   ├── blog/              # Blog post components
│   └── ...
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
├── theme/                 # MUI Theme configuration
├── auth/                  # Authentication logic
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
| Color     | Main       | Deskripsi          |
|-----------|------------|-------------------|
| Primary   | `#00A76F`  | Hijau (Default)   |
| Secondary | `#8E33FF`  | Ungu              |
| Info      | `#00B8D9`  | Cyan              |
| Success   | `#22C55E`  | Hijau muda        |
| Warning   | `#FFAB00`  | Kuning oranye     |
| Error     | `#FF5630`  | Merah             |

### Background Colors
- **Light Mode**: `#FFFFFF` (paper & default)
- **Dark Mode**: `grey[800]` (paper), `grey[900]` (default)

---

## 🔐 Sistem Autentikasi

Mendukung 5 provider autentikasi:
1. **JWT** (default) - `src/auth/context/jwt`
2. **Supabase** - `src/auth/context/supabase`
3. **Firebase** - `src/auth/context/firebase`
4. **Auth0** - `src/auth/context/auth0`
5. **AWS Amplify** - `src/auth/context/amplify`

Konfigurasi di `src/global-config.js`:
```javascript
auth: {
  method: 'jwt',      // Ubah sesuai kebutuhan
  skip: false,
  redirectPath: paths.dashboard.root
}
```

---

## 📍 Halaman Utama (Routes)

| Path                | Deskripsi                    |
|---------------------|------------------------------|
| `/`                 | Home - Landing page          |
| `/tentang-saya`     | About page                   |
| `/post`             | Daftar blog posts            |
| `/post/[title]`     | Detail blog post             |
| `/dashboard`        | Admin dashboard              |
| `/dashboard/post`   | Manage posts                 |
| `/dashboard/post/new` | Buat post baru            |
| `/auth/jwt/sign-in` | Login page                   |

---

## ⚙️ Fitur Dashboard (Admin)

1. **Dashboard** - Statistik & overview blog
2. **Posts** - Kelola artikel (CRUD)
3. **Media Library** - File manager untuk gambar
4. **My Profile** - Profil penulis
5. **Account Settings** - Password & preferensi

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

### Home Hero (`src/sections/home/home-hero.jsx`)
- Tagline: "Pendidik Visioner Dengan Prinsip **Agile**"
- Deskripsi: Fauzi M. Noor, Kepala Sekolah & pembelajar sepanjang hayat
- Buttons: "Tentang Saya" & "Baca Artikel Terbaru"

### FAQs (`src/sections/home/home-faqs.jsx`)
- CTA: "Punya ide atau pertanyaan??"
- Sub-text: "Ayo ngobrol sebentar ☕"

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

## 🔜 TODO / Langkah Selanjutnya

1. [ ] Ganti email `support@minimals.cc` dengan email pribadi
2. [ ] Sesuaikan FAQs dengan konten relevan
3. [ ] Upload foto profil & avatar
4. [ ] Setup Supabase untuk data persistence
5. [ ] Buat konten blog pertama
6. [ ] Kustomisasi SEO metadata

---

*Dokumentasi ini dibuat sebagai panduan untuk memahami dan mengembangkan aplikasi.*

