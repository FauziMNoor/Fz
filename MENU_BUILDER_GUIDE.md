# 🎯 Menu Builder System - Complete Guide

## 📋 Overview

**Menu Builder System** adalah fitur advanced untuk membuat dan mengelola menu navigasi secara dinamis. Kamu bisa membuat menu nested (bertingkat), mix categories dengan custom links, dan manage multiple menu locations (header, footer, sidebar).

**Status:** ✅ **Complete & Ready to Use!**

---

## 🎨 Features

### ✅ Multiple Menu Locations

- **Header** - Main navigation di bagian atas
- **Footer** - Links di footer
- **Sidebar** - Sidebar navigation

### ✅ Flexible Menu Items

- **Category** - Link ke post/ebook categories
- **Post** - Link ke specific post
- **E-Book** - Link ke specific ebook
- **Page** - Internal page link
- **Custom** - Custom internal link
- **External** - External website link

### ✅ Nested Structure

- Unlimited levels (parent → child → grandchild → ...)
- Visual tree view
- Drag & drop reordering (coming soon)

### ✅ Customization

- Icon picker (10 options)
- Color picker (6 options)
- Display order
- Active/Inactive toggle
- Target window (\_self / \_blank)

---

## 🗄️ Database Schema

### Table: `menus`

Container untuk menu locations

```sql
- id (UUID)
- name (VARCHAR) - e.g., "Main Navigation"
- slug (VARCHAR) - e.g., "main-nav"
- location (VARCHAR) - 'header', 'footer', 'sidebar'
- description (TEXT)
- is_active (BOOLEAN)
- created_at, updated_at
```

### Table: `menu_items`

Individual menu items dengan nested support

```sql
- id (UUID)
- menu_id (UUID) - Reference to menus
- parent_id (UUID) - NULL = root, has value = child
- title (VARCHAR) - Display text
- type (VARCHAR) - 'category', 'post', 'ebook', 'page', 'custom', 'external'
- reference_type (VARCHAR) - 'post_category', 'ebook_category'
- reference_id (UUID) - ID dari category/post/ebook
- url (TEXT) - For custom/external links
- icon (VARCHAR) - Icon name
- color (VARCHAR) - Color value
- description (TEXT)
- target (VARCHAR) - '_self', '_blank'
- display_order (INTEGER)
- level (INTEGER) - Auto-calculated (0, 1, 2, ...)
- is_active (BOOLEAN)
- created_at, updated_at
```

---

## 🚀 Quick Start

### Step 1: Run Migration

```bash
# Di Supabase SQL Editor, run:
supabase_migrations/create_menu_builder.sql
```

**Default menus akan dibuat:**

- Main Navigation (header)
- Footer Menu (footer)
- Sidebar Menu (sidebar)

**Default menu items untuk Main Navigation:**

- Home
- Blog (dengan children: Semua Artikel, Pendidikan, Agile, Kepemimpinan, Pesantren)
- E-Book (dengan children: Semua E-Book, Tauhid, Fiqh, Sirah)
- Tentang Saya

### Step 2: Access Menu Builder

```
Dashboard → Settings → Menu Builder
URL: /dashboard/menu
```

### Step 3: Manage Menu Items

1. Click "Manage Items" pada menu yang ingin dikelola
2. Click "Add Root Item" untuk item level pertama
3. Click "Add Child" pada item untuk membuat nested menu
4. Edit/Delete items sesuai kebutuhan

---

## 📚 Usage Examples

### Example 1: Simple Menu Structure

```
Home
Blog
E-Book
Tentang Saya
```

### Example 2: Nested Categories

```
Ilmu Islam
├── Tauhid
├── Fiqh
└── Sirah
    ├── Sahabat
    └── Sahabiyah
```

### Example 3: Mixed Menu

```
Home
Blog
├── Semua Artikel
├── Pendidikan
├── Agile
└── Kepemimpinan
E-Book
├── Tauhid
├── Fiqh
└── Sirah
Portfolio
Tentang Saya
Kontak (External Link)
```

---

## 🎨 UI Components

### 1. Menu List View

**Location:** `/dashboard/menu`

**Features:**

- Table view semua menus
- Create new menu
- Edit menu details
- Delete menu
- Manage items button

### 2. Menu Items View

**Location:** `/dashboard/menu/[menuId]`

**Features:**

- Tree view hierarchical structure
- Add root item
- Add child item
- Edit item
- Delete item
- Visual nesting dengan indentation

### 3. Menu Dialog

**Features:**

- Name, slug, location
- Description
- Active toggle

### 4. Menu Item Dialog

**Features:**

- Title
- Type selector
- Reference type (for categories)
- URL input (for pages/custom/external)
- Icon picker
- Color picker
- Description
- Target window
- Display order
- Active toggle

---

## 🔧 Helper Functions

### Menu Functions

```javascript
import {
  getMenus,
  getMenuBySlug,
  getMenuByLocation,
  createMenu,
  updateMenu,
  deleteMenu,
} from 'src/lib/supabase-client';

// Get all menus
const menus = await getMenus();

// Get menu by slug
const menu = await getMenuBySlug('main-nav');

// Get menu by location
const headerMenu = await getMenuByLocation('header');

// Create menu
const newMenu = await createMenu({
  name: 'Custom Menu',
  slug: 'custom-menu',
  location: 'sidebar',
  description: 'My custom menu',
  is_active: true,
});

// Update menu
await updateMenu(menuId, { name: 'Updated Name' });

// Delete menu
await deleteMenu(menuId);
```

### Menu Item Functions

```javascript
import {
  getMenuItems,
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} from 'src/lib/supabase-client';

// Get menu items (hierarchical tree)
const tree = await getMenuItems(menuId);

// Get all menu items (flat array)
const items = await getAllMenuItems(menuId);

// Get single item
const item = await getMenuItemById(itemId);

// Create menu item
const newItem = await createMenuItem({
  menu_id: menuId,
  parent_id: null, // or parentId for child
  title: 'My Page',
  type: 'page',
  url: '/my-page',
  icon: 'solar:home-angle-bold-duotone',
  color: 'primary.main',
  display_order: 1,
  is_active: true,
});

// Update menu item
await updateMenuItem(itemId, { title: 'Updated Title' });

// Delete menu item
await deleteMenuItem(itemId);

// Reorder items
await reorderMenuItems([
  { id: item1Id, display_order: 1 },
  { id: item2Id, display_order: 2 },
]);
```

### Public Menu Function

```javascript
import { getPublicMenu } from 'src/lib/supabase-client';

// Get active menu with items for public display
const menu = await getPublicMenu('header');

// Returns:
// {
//   id, name, slug, location, ...
//   items: [
//     {
//       id, title, type, url, icon, color, ...
//       children: [
//         { id, title, ... }
//       ]
//     }
//   ]
// }
```

---

## 🎯 Integration with Frontend

### Update Main Navigation

**File:** `src/layouts/nav-config-main.jsx`

```javascript
import { getPublicMenu } from 'src/lib/supabase-client';

// Fetch menu from database
export async function getNavData() {
  const menu = await getPublicMenu('header');

  if (!menu) return [];

  // Transform to navData format
  return menu.items.map((item) => ({
    title: item.title,
    path: item.url,
    icon: item.icon ? <Iconify icon={item.icon} /> : null,
    children: item.children?.map((child) => ({
      title: child.title,
      path: child.url,
    })),
  }));
}
```

### Dynamic Menu Component

```javascript
'use client';

import { useEffect, useState } from 'react';
import { getPublicMenu } from 'src/lib/supabase-client';

export function DynamicMenu({ location }) {
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    async function loadMenu() {
      const data = await getPublicMenu(location);
      setMenu(data);
    }
    loadMenu();
  }, [location]);

  if (!menu) return null;

  return (
    <nav>
      {menu.items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </nav>
  );
}

function MenuItem({ item }) {
  return (
    <div>
      <a href={item.url} target={item.target}>
        {item.icon && <Iconify icon={item.icon} />}
        {item.title}
      </a>
      {item.children?.length > 0 && (
        <div>
          {item.children.map((child) => (
            <MenuItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🔐 Security (RLS Policies)

### Public Access

- ✅ Can view active menus
- ✅ Can view active menu items

### Authenticated Users

- ✅ Can view all menus
- ✅ Can view all menu items

### Admin Only

- ✅ Can create menus
- ✅ Can update menus
- ✅ Can delete menus
- ✅ Can manage menu items

---

## 📊 Database Features

### Auto-calculated Level

Menu item level dihitung otomatis berdasarkan parent:

- Root item (parent_id = NULL) → level = 0
- Child item → level = parent.level + 1

### Auto-update Timestamps

`updated_at` otomatis diupdate saat data berubah

### Cascade Delete

Saat menu dihapus, semua menu items ikut terhapus

### Hierarchical View

View `menu_tree` untuk query hierarchical structure dengan recursive CTE

---

## 🎨 Icon Options

10 icon options tersedia:

1. `solar:home-angle-bold-duotone` - Home
2. `solar:document-text-bold-duotone` - Document
3. `solar:book-bold-duotone` - Book
4. `solar:user-bold-duotone` - User
5. `solar:folder-bold-duotone` - Folder
6. `solar:tag-bold-duotone` - Tag
7. `solar:star-bold-duotone` - Star
8. `solar:heart-bold-duotone` - Heart
9. `solar:settings-bold-duotone` - Settings
10. `solar:info-circle-bold-duotone` - Info

---

## 🎨 Color Options

6 color options tersedia:

1. `primary.main` - Primary color
2. `secondary.main` - Secondary color
3. `info.main` - Info color
4. `success.main` - Success color
5. `warning.main` - Warning color
6. `error.main` - Error color

---

## 🔜 Next Steps

### Phase 1: ✅ Complete

- [x] Database schema
- [x] Helper functions
- [x] Dashboard UI
- [x] CRUD operations
- [x] Tree view
- [x] Nested structure

### Phase 2: 🚧 Coming Soon

- [ ] Drag & drop reordering
- [ ] Bulk operations
- [ ] Import/Export menus
- [ ] Menu templates
- [ ] Preview mode

### Phase 3: 🚧 Integration

- [ ] Replace static nav-config-main.jsx
- [ ] Dynamic header menu
- [ ] Dynamic footer menu
- [ ] Dynamic sidebar menu
- [ ] Cache optimization

---

## 📝 Tips & Best Practices

### 1. Menu Structure

- Keep menu depth max 3 levels (parent → child → grandchild)
- Use clear, descriptive titles
- Group related items together

### 2. Display Order

- Use increments of 10 (10, 20, 30) untuk flexibility
- Lower numbers appear first
- Easy to insert items between

### 3. Icons & Colors

- Use consistent icons for similar types
- Don't overuse colors
- Keep it simple and clean

### 4. Performance

- Limit menu items per menu (max 20-30)
- Use active/inactive toggle instead of delete
- Cache menu data on frontend

### 5. SEO

- Use descriptive titles
- Proper URL structure
- Internal linking strategy

---

## 🐛 Troubleshooting

### Menu items not showing

- Check `is_active` status
- Check RLS policies
- Verify menu_id reference

### Nested items not working

- Verify parent_id is correct
- Check level calculation
- Ensure parent exists

### Cannot delete menu

- Check if menu has items
- Cascade delete should work
- Check RLS policies

---

## 📚 Files Created

### Migration

- `supabase_migrations/create_menu_builder.sql`

### Components

- `src/sections/menu/menu-list-view.jsx`
- `src/sections/menu/menu-table-row.jsx`
- `src/sections/menu/menu-dialog.jsx`
- `src/sections/menu/menu-item-list-view.jsx`
- `src/sections/menu/menu-item-tree.jsx`
- `src/sections/menu/menu-item-dialog.jsx`
- `src/sections/menu/view/menu-list-view-wrapper.jsx`
- `src/sections/menu/view/menu-item-list-view-wrapper.jsx`

### Pages

- `src/app/dashboard/menu/page.jsx`
- `src/app/dashboard/menu/[id]/page.jsx`

### Helper Functions

- `src/lib/supabase-client.js` (added menu functions)

### Routes

- `src/routes/paths.js` (added menu routes)

### Navigation

- `src/layouts/nav-config-dashboard.jsx` (added menu builder link)

### Documentation

- `MENU_BUILDER_GUIDE.md` (this file)

---

## 🎉 Summary

Menu Builder System sekarang **fully functional**! Kamu bisa:

✅ Create multiple menus (header, footer, sidebar)
✅ Add nested menu items (unlimited levels)
✅ Mix categories, posts, ebooks, pages, custom links
✅ Customize icons & colors
✅ Reorder items
✅ Active/Inactive toggle
✅ Visual tree view
✅ Full CRUD operations

**Next:** Integrate dengan frontend untuk dynamic navigation!

---

**Last Updated:** 2025-12-07
**Version:** 1.0.0
**Author:** Fauzi M. Noor
