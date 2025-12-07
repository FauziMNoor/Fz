# 🚀 Quick Start - Menu Builder System

## ⚡ 3 Steps to Get Started

### Step 1: Run Migration (2 minutes)

1. Buka **Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
2. Klik **SQL Editor** di sidebar kiri

3. Click **New Query**

4. Copy-paste isi file ini:

   ```
   supabase_migrations/create_menu_builder.sql
   ```

5. Click **Run** (atau tekan F5)

6. Tunggu sampai muncul success message:
   ```
   ✅ Menu Builder System created successfully!
   📋 Tables: menus, menu_items
   🔐 RLS policies enabled
   📊 Default menus created: main-nav, footer-menu, sidebar-menu
   🎯 Ready to use!
   ```

### Step 2: Access Menu Builder (1 minute)

1. Buka aplikasi: http://localhost:3032

2. Login sebagai admin:

   - Email: `fauzimnoor90@gmail.com`
   - Password: `password123`

3. Di dashboard, klik **Settings** → **Menu Builder**
   - Atau langsung ke: http://localhost:3032/dashboard/menu

### Step 3: Manage Menu Items (5 minutes)

1. Klik **Manage Items** pada "Main Navigation"

2. Kamu akan lihat default menu items:

   ```
   Home
   Blog
   ├── Semua Artikel
   ├── Pendidikan
   ├── Agile
   ├── Kepemimpinan
   └── Pesantren
   E-Book
   ├── Semua E-Book
   ├── Tauhid
   ├── Fiqh
   └── Sirah
   Tentang Saya
   ```

3. Try it:
   - Click **Add Root Item** untuk item baru
   - Click **Add Child** pada item untuk nested menu
   - Click **Edit** untuk ubah item
   - Click **Delete** untuk hapus item

---

## 🎯 Example: Create "Ilmu Islam" Menu

### Goal Structure:

```
Ilmu Islam
├── Tauhid
├── Fiqh
└── Sirah
    ├── Sahabat
    └── Sahabiyah
```

### Steps:

1. **Add Root Item: "Ilmu Islam"**

   - Title: `Ilmu Islam`
   - Type: `Page`
   - URL: `/post?category=ilmu-islam`
   - Icon: `solar:book-bold-duotone`
   - Color: `primary.main`
   - Display Order: `5`

2. **Add Child: "Tauhid"**

   - Click "Add Child" pada "Ilmu Islam"
   - Title: `Tauhid`
   - Type: `Category`
   - Reference Type: `Post Category`
   - URL: `/post?category=tauhid`
   - Display Order: `1`

3. **Add Child: "Fiqh"**

   - Click "Add Child" pada "Ilmu Islam"
   - Title: `Fiqh`
   - Type: `Category`
   - Reference Type: `Post Category`
   - URL: `/post?category=fiqh`
   - Display Order: `2`

4. **Add Child: "Sirah"**

   - Click "Add Child" pada "Ilmu Islam"
   - Title: `Sirah`
   - Type: `Category`
   - Reference Type: `Post Category`
   - URL: `/post?category=sirah`
   - Display Order: `3`

5. **Add Grandchild: "Sahabat"**

   - Click "Add Child" pada "Sirah"
   - Title: `Sahabat`
   - Type: `Category`
   - Reference Type: `Post Category`
   - URL: `/post?category=sahabat`
   - Display Order: `1`

6. **Add Grandchild: "Sahabiyah"**
   - Click "Add Child" pada "Sirah"
   - Title: `Sahabiyah`
   - Type: `Category`
   - Reference Type: `Post Category`
   - URL: `/post?category=sahabiyah`
   - Display Order: `2`

**Done!** 🎉

---

## 📊 What's Created?

### Tables

- ✅ `menus` - Menu containers (3 default menus)
- ✅ `menu_items` - Menu items dengan nested support

### Default Menus

1. **Main Navigation** (header)

   - Home
   - Blog (dengan 5 categories)
   - E-Book (dengan 3 categories)
   - Tentang Saya

2. **Footer Menu** (footer)

   - Empty (ready to customize)

3. **Sidebar Menu** (sidebar)
   - Empty (ready to customize)

### Features

- ✅ Unlimited nesting levels
- ✅ 10 icon options
- ✅ 6 color options
- ✅ Active/Inactive toggle
- ✅ Display order
- ✅ Multiple menu types (category, post, ebook, page, custom, external)

---

## 🎨 Menu Item Types

| Type         | Description            | Example             |
| ------------ | ---------------------- | ------------------- |
| **Category** | Link to category       | Blog → Pendidikan   |
| **Post**     | Link to specific post  | Featured Article    |
| **E-Book**   | Link to specific ebook | My E-Book           |
| **Page**     | Internal page          | /tentang-saya       |
| **Custom**   | Custom internal link   | /custom-page        |
| **External** | External website       | https://example.com |

---

## 🔧 Helper Functions Available

```javascript
// Import functions
import {
  getMenus,
  getMenuBySlug,
  getMenuByLocation,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPublicMenu,
} from 'src/lib/supabase-client';

// Get menu for public display
const menu = await getPublicMenu('header');
```

---

## 🎯 Next Steps

### 1. Customize Default Menu

- Edit existing items
- Add your own categories
- Reorder items

### 2. Create Footer Menu

- Add useful links
- Social media links
- Legal pages

### 3. Create Sidebar Menu

- Quick links
- Popular categories
- Recent posts

### 4. Integrate with Frontend

- Replace static nav-config-main.jsx
- Use dynamic menu rendering
- See `MENU_BUILDER_GUIDE.md` for details

---

## 📚 Full Documentation

Lihat **MENU_BUILDER_GUIDE.md** untuk:

- Complete feature list
- Database schema details
- All helper functions
- Integration examples
- Best practices
- Troubleshooting

---

## ✅ Checklist

- [ ] Run migration SQL
- [ ] Access menu builder
- [ ] View default menus
- [ ] Create test menu item
- [ ] Create nested menu
- [ ] Customize main navigation
- [ ] Read full documentation

---

**Ready to build your custom menus!** 🚀

**Last Updated:** 2025-12-07
