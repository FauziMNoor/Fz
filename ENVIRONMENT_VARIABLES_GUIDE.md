# 🔑 Environment Variables - Panduan Lengkap

**Untuk Deployment ke Vercel**

---

## 📋 Apa itu Environment Variables?

Environment variables adalah **konfigurasi rahasia** yang dibutuhkan aplikasi Anda untuk berjalan. Ini seperti **kunci** yang membuka akses ke database dan layanan lainnya.

**⚠️ PENTING:** Jangan pernah commit file `.env` ke GitHub!

---

## 🔍 Langkah 1: Cek File .env Anda

### 1.1 Buka File .env

File ini ada di **root folder** project Anda:

```
D:\Fz\.env
```

### 1.2 Isi File .env

`.env` Anda berisi:

```bash
# Server url
NEXT_PUBLIC_SERVER_URL=https://api-dev-minimal-v700.pages.dev

# Supabase (YANG PALING PENTING!)
NEXT_PUBLIC_SUPABASE_URL=https://nvppnowugnjfvquvibqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cHBub3d1Z25qZnZxdXZpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODcyMjUsImV4cCI6MjA4MDI2MzIyNX0.D5QiRVmTju-_1nAq7Y9J5eDAitLF5tgE0Bve-bcZW2M
```

---

## 📝 Langkah 2: Copy Environment Variables

### 2.1 Yang WAJIB Dicopy

Anda **HARUS** copy 2 variable ini:

#### ✅ Variable 1: NEXT_PUBLIC_SUPABASE_URL

```
Nama: NEXT_PUBLIC_SUPABASE_URL
Value: https://nvppnowugnjfvquvibqc.supabase.co
```

#### ✅ Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

```
Nama: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cHBub3d1Z25qZnZxdXZpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODcyMjUsImV4cCI6MjA4MDI2MzIyNX0.D5QiRVmTju-_1nAq7Y9J5eDAitLF5tgE0Bve-bcZW2M
```

### 2.2 Yang OPSIONAL

#### ⚪ Variable 3: NEXT_PUBLIC_SERVER_URL (Optional)

```
Nama: NEXT_PUBLIC_SERVER_URL
Value: https://api-dev-minimal-v700.pages.dev
```

**Note:** Variable ini opsional, aplikasi tetap jalan tanpa ini.

---

## 🌐 Langkah 3: Tambahkan ke Vercel

### 3.1 Saat Deploy Pertama Kali

Ketika Anda di halaman "Configure Project" di Vercel:

```
┌─────────────────────────────────────────────┐
│  Configure Project                          │
├─────────────────────────────────────────────┤
│                                             │
│  Framework Preset: Next.js ✓                │
│  Root Directory: ./                         │
│                                             │
│  ▼ Environment Variables                    │
│  ┌─────────────────────────────────────┐   │
│  │ Name                                │   │
│  │ NEXT_PUBLIC_SUPABASE_URL            │   │
│  ├─────────────────────────────────────┤   │
│  │ Value                               │   │
│  │ https://nvppnowugnjfvquvibqc...     │   │
│  ├─────────────────────────────────────┤   │
│  │ ☑ Production                        │   │
│  │ ☑ Preview                           │   │
│  │ ☑ Development                       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [+ Add Another]                            │
│                                             │
│  [Deploy] ←── Klik ini setelah selesai     │
└─────────────────────────────────────────────┘
```

### 3.2 Cara Menambahkan (Step by Step)

#### Step 1: Tambah Variable Pertama

1. **Klik** di field "Name"
2. **Ketik:** `NEXT_PUBLIC_SUPABASE_URL`
3. **Klik** di field "Value"
4. **Paste:** `https://nvppnowugnjfvquvibqc.supabase.co`
5. **Centang** semua: Production, Preview, Development
6. **Klik** "Add Another"

#### Step 2: Tambah Variable Kedua

1. **Klik** di field "Name" yang baru
2. **Ketik:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Klik** di field "Value"
4. **Paste:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cHBub3d1Z25qZnZxdXZpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODcyMjUsImV4cCI6MjA4MDI2MzIyNX0.D5QiRVmTju-_1nAq7Y9J5eDAitLF5tgE0Bve-bcZW2M`
5. **Centang** semua: Production, Preview, Development

#### Step 3: (Optional) Tambah Variable Ketiga

1. **Klik** "Add Another"
2. **Ketik:** `NEXT_PUBLIC_SERVER_URL`
3. **Paste:** `https://api-dev-minimal-v700.pages.dev`
4. **Centang** semua: Production, Preview, Development

#### Step 4: Deploy!

**Klik** tombol "Deploy" di bawah

---

## 🔧 Langkah 4: Jika Sudah Deploy (Tambah Variable Nanti)

### 4.1 Buka Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Klik project Anda
3. Klik tab "Settings"
4. Klik "Environment Variables" di sidebar

### 4.2 Tambah Variable Baru

```
┌─────────────────────────────────────────────┐
│  Environment Variables                      │
├─────────────────────────────────────────────┤
│                                             │
│  [+ Add New]  ←── Klik ini                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Key                                 │   │
│  │ NEXT_PUBLIC_SUPABASE_URL            │   │
│  ├─────────────────────────────────────┤   │
│  │ Value                               │   │
│  │ https://nvppnowugnjfvquvibqc...     │   │
│  ├─────────────────────────────────────┤   │
│  │ Environment                         │   │
│  │ ☑ Production                        │   │
│  │ ☑ Preview                           │   │
│  │ ☑ Development                       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Save]  ←── Klik ini                       │
└─────────────────────────────────────────────┘
```

### 4.3 Redeploy

Setelah menambah variable:

1. Klik tab "Deployments"
2. Klik "..." di deployment terakhir
3. Klik "Redeploy"

---

## ✅ Checklist Environment Variables

Pastikan Anda sudah menambahkan:

### Wajib (MUST HAVE):

- [ ] `NEXT_PUBLIC_SUPABASE_URL` ✅
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅

### Opsional (NICE TO HAVE):

- [ ] `NEXT_PUBLIC_SERVER_URL` ⚪

### Untuk Semua Variable:

- [ ] Centang "Production" ✅
- [ ] Centang "Preview" ✅
- [ ] Centang "Development" ✅

---

## 🔍 Cara Verifikasi Environment Variables

### Di Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Klik project Anda
3. Klik "Settings"
4. Klik "Environment Variables"
5. Anda harus lihat:

```
┌──────────────────────────────────────────────────┐
│ Environment Variables                            │
├──────────────────────────────────────────────────┤
│                                                  │
│ NEXT_PUBLIC_SUPABASE_URL                         │
│ Production, Preview, Development                 │
│ [Edit] [Delete]                                  │
│                                                  │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY                    │
│ Production, Preview, Development                 │
│ [Edit] [Delete]                                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## ❌ Troubleshooting

### Error: "Supabase URL is not defined"

**Penyebab:** Environment variable tidak ditambahkan atau salah nama

**Solusi:**

1. Cek nama variable: `NEXT_PUBLIC_SUPABASE_URL` (harus persis!)
2. Cek value: harus ada `https://`
3. Cek environment: harus centang Production
4. Redeploy setelah menambahkan

### Error: "Invalid Supabase key"

**Penyebab:** Anon key salah atau tidak lengkap

**Solusi:**

1. Copy ulang dari file `.env`
2. Pastikan copy full (sangat panjang!)
3. Jangan ada spasi di awal/akhir
4. Redeploy

### Error: "Failed to connect to database"

**Penyebab:** Supabase project tidak aktif atau RLS policy

**Solusi:**

1. Cek Supabase dashboard: https://supabase.com/dashboard
2. Pastikan project aktif
3. Cek RLS policies di database

---

## 📝 Copy-Paste Ready

### Untuk Vercel (Copy ini):

**Variable 1:**

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://nvppnowugnjfvquvibqc.supabase.co
Environment: Production, Preview, Development
```

**Variable 2:**

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cHBub3d1Z25qZnZxdXZpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODcyMjUsImV4cCI6MjA4MDI2MzIyNX0.D5QiRVmTju-_1nAq7Y9J5eDAitLF5tgE0Bve-bcZW2M
Environment: Production, Preview, Development
```

**Variable 3 (Optional):**

```
Name: NEXT_PUBLIC_SERVER_URL
Value: https://api-dev-minimal-v700.pages.dev
Environment: Production, Preview, Development
```

---

## 🎯 Tips Penting

### ✅ Do's:

- ✅ Copy-paste langsung dari file `.env`
- ✅ Centang semua environment (Production, Preview, Development)
- ✅ Double-check nama variable (harus persis!)
- ✅ Simpan credentials di tempat aman

### ❌ Don'ts:

- ❌ Jangan ketik manual (bisa typo!)
- ❌ Jangan commit `.env` ke GitHub
- ❌ Jangan share credentials di public
- ❌ Jangan lupa centang environment

---

## 🆘 Butuh Bantuan?

### Jika Masih Bingung:

1. **Screenshot** halaman Vercel Anda
2. **Screenshot** error message (jika ada)
3. Tanyakan ke saya dengan detail error

### Useful Links:

- **Vercel Docs:** https://vercel.com/docs/concepts/projects/environment-variables
- **Supabase Dashboard:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc

---

**Panduan dibuat:** December 7, 2025
**By:** Kiro AI Assistant

**Semoga membantu! 🚀**
