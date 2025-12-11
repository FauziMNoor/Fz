# 💬 Panduan Moderasi Komentar

## 📋 Fitur Moderasi Komentar

Halaman moderasi komentar memungkinkan Anda untuk:

- ✅ Melihat semua komentar (pending, approved, rejected)
- ✅ Menyetujui komentar untuk ditampilkan
- ✅ Menolak komentar spam atau tidak pantas
- ✅ Menghapus komentar permanen
- ✅ Filter berdasarkan status

---

## 🚀 Cara Menggunakan

### 1. Akses Halaman Moderasi

**Dashboard → Comments**

URL: `http://localhost:3032/dashboard/comments`

### 2. Tab Filter Status

- **Semua** - Tampilkan semua komentar
- **Menunggu** - Komentar yang perlu direview (status: pending)
- **Disetujui** - Komentar yang sudah tampil di public (status: approved)
- **Ditolak** - Komentar yang ditolak (status: rejected)

### 3. Informasi yang Ditampilkan

Setiap komentar menampilkan:

- **Avatar & Nama** - Foto dan nama user/guest
- **Email** - Email guest (jika guest comment)
- **Komentar** - Isi komentar (max 2 baris)
- **Post** - Judul post yang dikomentari
- **Status** - Label status (Menunggu/Disetujui/Ditolak)
- **Tanggal** - Kapan komentar dibuat

### 4. Aksi yang Tersedia

#### Untuk Komentar Pending (Menunggu):

- ✅ **Setujui** (icon centang hijau) - Komentar akan tampil di public
- ❌ **Tolak** (icon X merah) - Komentar tidak akan tampil

#### Untuk Komentar Approved (Disetujui):

- ❌ **Tolak** (icon X kuning) - Sembunyikan komentar dari public

#### Untuk Komentar Rejected (Ditolak):

- ✅ **Setujui** (icon centang hijau) - Tampilkan kembali di public

#### Untuk Semua Komentar:

- 🗑️ **Hapus** (icon trash merah) - Hapus permanen dari database

---

## 🔄 Alur Komentar

### 1. User Submit Komentar

```
Guest/User → Tulis komentar → Kirim
```

### 2. Komentar Masuk Database

```
Status: "pending" (menunggu)
Komentar BELUM tampil di public
```

### 3. Admin Moderasi

```
Dashboard → Comments → Review → Approve/Reject
```

### 4. Komentar Tampil

```
Status: "approved"
Komentar TAMPIL di halaman post public
```

---

## 📊 Status Komentar

### 🟡 Pending (Menunggu)

- Komentar baru yang belum direview
- **Tidak tampil** di halaman public
- Perlu action dari admin

### 🟢 Approved (Disetujui)

- Komentar yang sudah disetujui
- **Tampil** di halaman post public
- User dapat melihat komentar ini

### 🔴 Rejected (Ditolak)

- Komentar spam atau tidak pantas
- **Tidak tampil** di halaman public
- Masih tersimpan di database (bisa disetujui lagi)

---

## 💡 Tips Moderasi

### ✅ Setujui Komentar Jika:

- Relevan dengan topik post
- Tidak mengandung spam
- Tidak mengandung kata-kata kasar
- Memberikan feedback konstruktif
- Bertanya dengan sopan

### ❌ Tolak Komentar Jika:

- Spam atau iklan
- Mengandung link mencurigakan
- Kata-kata kasar atau offensive
- Tidak relevan dengan post
- Duplicate comment

### 🗑️ Hapus Komentar Jika:

- Spam berulang dari user yang sama
- Konten ilegal atau berbahaya
- Sudah ditolak dan tidak perlu disimpan

---

## 🔐 Keamanan

### RLS Policies

Hanya post author yang bisa:

- Melihat semua komentar di post mereka
- Approve/reject komentar
- Hapus komentar

### Guest Comments

- Guest harus isi nama dan email
- Email tidak ditampilkan di public
- Hanya admin yang bisa lihat email guest

---

## 🎯 Shortcut Keyboard

- **Tab** - Pindah antar filter status
- **Enter** - Approve komentar yang dipilih
- **Delete** - Hapus komentar yang dipilih

---

## 📱 Responsive Design

Halaman moderasi responsive untuk:

- 💻 Desktop - Tampilan tabel penuh
- 📱 Tablet - Tabel dengan scroll horizontal
- 📱 Mobile - Card view (coming soon)

---

## 🐛 Troubleshooting

### Komentar tidak muncul di list

- Pastikan migration sudah dijalankan
- Cek RLS policies di Supabase
- Refresh halaman

### Tidak bisa approve/reject

- Pastikan Anda login sebagai post author
- Cek console browser untuk error
- Cek RLS policies

### Error saat hapus komentar

- Pastikan komentar tidak sedang digunakan
- Cek foreign key constraints
- Refresh dan coba lagi

---

## 📈 Statistik

Di bagian atas tab, Anda bisa lihat:

- Total semua komentar
- Jumlah komentar pending
- Jumlah komentar approved
- Jumlah komentar rejected

---

## 🔄 Auto-Refresh

Halaman akan auto-refresh setelah:

- Approve komentar
- Reject komentar
- Hapus komentar

Tidak perlu refresh manual!

---

## 📝 Best Practices

1. **Review Rutin** - Cek komentar pending setiap hari
2. **Respond Cepat** - Approve komentar bagus dengan cepat
3. **Komunikasi** - Balas komentar yang bertanya
4. **Konsisten** - Gunakan standar yang sama untuk semua komentar
5. **Backup** - Jangan langsung hapus, tolak dulu untuk review

---

**Dibuat:** 11 Desember 2025
**Update Terakhir:** 11 Desember 2025
