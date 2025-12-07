# ✅ Integrasi Lengkap Account Settings dengan Database

## 📋 Ringkasan

Semua tab di Account Settings (`/dashboard/user/account`) sekarang **terintegrasi penuh dengan Supabase database**:

- ✅ **General** - Profile information (nama, email, phone, address, avatar)
- ✅ **Notifications** - Email notification preferences
- ✅ **Social Links** - Social media URLs (Facebook, Instagram, LinkedIn, Twitter)
- ✅ **Security** - Change password menggunakan Supabase Auth

---

## 🗄️ Struktur Database

### Tabel `profiles` - 20 Kolom Total

| # | Column | Type | Tab | Description |
|---|--------|------|-----|-------------|
| 1 | `id` | uuid | - | User ID (PK) |
| 2 | `email` | text | General | Email address |
| 3 | `full_name` | text | General | Full name |
| 4 | `avatar_url` | text | General | Avatar image URL |
| 5 | `bio` | text | General | About/bio text |
| 6 | `role` | text | - | User role (admin/user) |
| 7 | `created_at` | timestamp | - | Created timestamp |
| 8 | `updated_at` | timestamp | - | Updated timestamp |
| 9 | `phone_number` | text | General | Phone number |
| 10 | `country` | text | General | Country |
| 11 | `address` | text | General | Street address |
| 12 | `state` | text | General | State/region |
| 13 | `city` | text | General | City |
| 14 | `zip_code` | text | General | Zip/postal code |
| 15 | `is_public` | boolean | General | Public profile flag |
| 16 | `social_facebook` | text | Social Links | Facebook URL |
| 17 | `social_instagram` | text | Social Links | Instagram URL |
| 18 | `social_linkedin` | text | Social Links | LinkedIn URL |
| 19 | `social_twitter` | text | Social Links | Twitter/X URL |
| 20 | `notification_preferences` | jsonb | Notifications | Notification settings |

**Status:** ✅ Semua kolom sudah ditambahkan ke database!

---

## 🔧 Helper Functions di `src/lib/supabase-client.js`

### Profile Management
```javascript
getUserProfile(userId)              // Get user profile
updateUserProfile(userId, data)     // Update profile
```

### Storage
```javascript
uploadAvatar(userId, file)          // Upload avatar to storage
deleteAvatar(userId)                // Delete avatar
uploadPostImage(postId, file)       // Upload post image
```

### Social Links
```javascript
updateSocialLinks(userId, links)    // Update social media links
```

### Notifications
```javascript
updateNotificationPreferences(userId, prefs)  // Update notification settings
```

### Password
```javascript
changePassword(newPassword)         // Change password via Supabase Auth
```

---

## 📁 File yang Diubah

### 1. Database
- ✅ Menambahkan 12 kolom baru ke tabel `profiles`

### 2. Helper Functions (`src/lib/supabase-client.js`)
- ✅ `updateSocialLinks()` - Update social media links
- ✅ `updateNotificationPreferences()` - Update notification settings
- ✅ `changePassword()` - Change password via Supabase Auth

### 3. Components

**General Tab:**
- ✅ `src/sections/account/account-general.jsx` - Terintegrasi dengan database
- ✅ `src/sections/account/view/account-general-view.jsx` - Fetch data dari database

**Social Links Tab:**
- ✅ `src/sections/account/account-socials.jsx` - Save ke database
- ✅ `src/sections/account/view/account-socials-view.jsx` - Fetch data dari database

**Notifications Tab:**
- ✅ `src/sections/account/account-notifications.jsx` - Save ke database
- ✅ `src/sections/account/view/account-notifications-view.jsx` - Fetch data dari database

**Security Tab:**
- ✅ `src/sections/account/account-change-password.jsx` - Menggunakan Supabase Auth API

---

## 🧪 Cara Testing

### 1. Test General Tab
1. Login ke http://localhost:3032/dashboard/user/account
2. Edit nama, phone, address, dll
3. Upload avatar (pastikan bucket `avatars` sudah dibuat)
4. Klik **"Save changes"**
5. Reload halaman → data harus masih ada ✅

### 2. Test Social Links Tab
1. Klik tab **"Social links"**
2. Isi URL Facebook, Instagram, LinkedIn, Twitter
3. Klik **"Save changes"**
4. Reload halaman → URL harus masih ada ✅

### 3. Test Notifications Tab
1. Klik tab **"Notifications"**
2. Toggle beberapa notification switches
3. Klik **"Save changes"**
4. Reload halaman → settings harus masih sama ✅

### 4. Test Security Tab
1. Klik tab **"Security"**
2. Isi old password, new password, confirm password
3. Klik **"Save changes"**
4. Logout dan login dengan password baru ✅

---

## 🔍 Verifikasi Database

Cek data di Supabase Dashboard → Table Editor → profiles:

```sql
SELECT 
  id, email, full_name, phone_number, country,
  social_facebook, social_instagram, social_linkedin, social_twitter,
  notification_preferences
FROM profiles 
WHERE email = 'fauzimnoor90@gmail.com';
```

---

**Last Updated:** 2025-12-03  
**Author:** Fauzi M. Noor

