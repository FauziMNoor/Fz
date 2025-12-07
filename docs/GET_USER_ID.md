# Cara Mendapatkan User ID untuk Public Profile

## Langkah-langkah:

### 1. Login ke Dashboard

Buka browser dan login ke dashboard: `http://localhost:3032/dashboard/user/`

### 2. Buka Browser Console

Tekan `F12` atau klik kanan → Inspect → Console

### 3. Jalankan Command Ini

```javascript
// Copy paste command ini di console
const { data } = await supabase.auth.getUser();
console.log('Your User ID:', data.user.id);
```

### 4. Copy User ID

Copy user ID yang muncul di console (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 5. Update File public-profile-view.jsx

Buka file: `src/sections/user/view/public-profile-view.jsx`

Cari baris ini (sekitar baris 54):

```javascript
const PUBLIC_USER_ID = 'YOUR_USER_ID_HERE';
```

Ganti dengan user ID Anda:

```javascript
const PUBLIC_USER_ID = 'paste-user-id-anda-disini';
```

### 6. Save dan Refresh

Save file dan refresh browser di halaman `/tentang-saya`

## Alternatif: Ambil dari Database

Jika cara di atas tidak berhasil, bisa ambil langsung dari Supabase:

1. Buka Supabase Dashboard
2. Pergi ke **Table Editor** → **auth.users**
3. Copy ID dari user yang ingin ditampilkan
4. Paste ke `PUBLIC_USER_ID` di file `public-profile-view.jsx`

## Fitur Public Profile

Setelah dikonfigurasi, halaman `/tentang-saya` akan menampilkan:

✅ Profile info (About, Social)
✅ Posts (read-only, tidak bisa edit/delete)
✅ Portfolio (read-only)
✅ Followers & Friends

❌ Tidak ada input post baru
❌ Tidak ada tombol edit/delete
❌ Hanya untuk viewing saja

## Testing

1. Buka `/tentang-saya` → Lihat profile public (read-only)
2. Buka `/dashboard/user/` → Lihat profile owner (full CRUD)
