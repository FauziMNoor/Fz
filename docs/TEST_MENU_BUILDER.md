# ✅ Menu Builder - Testing Checklist

## 🧪 Testing Guide

Gunakan checklist ini untuk memastikan semua fitur Menu Builder berfungsi dengan baik.

---

## 📋 Pre-Testing Setup

### ✅ Step 1: Run Migration

- [ ] Buka Supabase SQL Editor
- [ ] Run `supabase_migrations/create_menu_builder.sql`
- [ ] Verify success message muncul
- [ ] Check tables created: `menus`, `menu_items`

### ✅ Step 2: Verify Default Data

- [ ] 3 menus created (main-nav, footer-menu, sidebar-menu)
- [ ] Main Navigation has default items
- [ ] Footer Menu is empty
- [ ] Sidebar Menu is empty

### ✅ Step 3: Access Dashboard

- [ ] Login as admin
- [ ] Navigate to Dashboard → Settings → Menu Builder
- [ ] URL: `/dashboard/menu`
- [ ] Page loads without errors

---

## 🧪 Test Cases

### Test 1: View Menus ✅

**Goal:** Verify menu list displays correctly

- [ ] See 3 menus in table
- [ ] Each menu shows: name, location, status
- [ ] "Manage Items" button visible
- [ ] Actions menu (⋮) works

**Expected Result:**

```
Main Navigation    Header     [Manage Items]  Active
Footer Menu        Footer     [Manage Items]  Active
Sidebar Menu       Sidebar    [Manage Items]  Active
```

---

### Test 2: Create New Menu ✅

**Goal:** Create a custom menu

**Steps:**

1. [ ] Click "New Menu" button
2. [ ] Fill form:

- Menu`
- Slug: `test-menu`
- Location: `sidebar`
- Description: `Testing menu`
- Active: `true`

3. [ ] Click "Create"
4. [ ] Verify success toast
5. [ ] New menu appears in list

**Expected Result:**

- ✅ Menu created successfully
- ✅ Appears in table
- ✅ Can manage items

---

### Test 3: Edit Menu ✅

**Goal:** Update menu details

**Steps:**

1. [ ] Click actions (⋮) on "Test Menu"
2. [ ] Click "Edit"
3. [ ] Change name to `Updated Test Menu`
4. [ ] Click "Update"
5. [ ] Verify success toast
6. [ ] Name updated in table

**Expected Result:**

- ✅ Menu updated successfully
- ✅ Changes reflected immediately

---

### Test 4: View Menu Items ✅

**Goal:** View default menu items

**Steps:**

1. [ ] Click "Manage Items" on "Main Navigation"
2. [ ] Verify tree view displays
3. [ ] See nested structure
4. [ ] Icons and colors visible
5. [ ] Display order shown

**Expected Result:**

```
🏠 Home                    Order: 1
📝 Blog                    Order: 2
  ├─ Semua Artikel         Order: 1
  ├─ Pendidikan            Order: 2
  ├─ Agile                 Order: 3
  ├─ Kepemimpinan          Order: 4
  └─ Pesantren             Order: 5
📚 E-Book                  Order: 3
  ├─ Semua E-Book          Order: 1
  ├─ Tauhid                Order: 2
  ├─ Fiqh                  Order: 3
  └─ Sirah                 Order: 4
👤 Tentang Saya            Order: 4
```

---

### Test 5: Add Root Menu Item ✅

**Goal:** Create top-level menu item

**Steps:**

1. [ ] Click "Add Root Item"
2. [ ] Fill form:
   - Title: `Portfolio`
   - Type: `Page`
   - URL: `/portfolio`
   - Icon: `solar:folder-bold-duotone`
   - Color: `info.main`
   - Display Order: `5`
   - Active: `true`
3. [ ] Click "Create"
4. [ ] Verify success toast
5. [ ] New item appears in tree

**Expected Result:**

- ✅ Item created at root level
- ✅ Appears with correct icon/color
- ✅ Order: 5 (after Tentang Saya)

---

### Test 6: Add Child Menu Item ✅

**Goal:** Create nested menu item

**Steps:**

1. [ ] Click "Add Child" on "Portfolio"
2. [ ] Fill form:
   - Title: `Web Development`
   - Type: `Category`
   - Reference Type: `Post Category`
   - URL: `/portfolio?category=web-dev`
   - Display Order: `1`
3. [ ] Click "Create"
4. [ ] Verify item appears under Portfolio
5. [ ] Check indentation

**Expected Result:**

```
📁 Portfolio               Order: 5
  └─ Web Development       Order: 1
```

---

### Test 7: Add Grandchild Menu Item ✅

**Goal:** Create 3-level nested menu

**Steps:**

1. [ ] Click "Add Child" on "Web Development"
2. [ ] Fill form:
   - Title: `React Projects`
   - Type: `Custom`
   - URL: `/portfolio/react`
   - Display Order: `1`
3. [ ] Click "Create"
4. [ ] Verify 3-level nesting

**Expected Result:**

```
📁 Portfolio               Order: 5
  └─ Web Development       Order: 1
      └─ React Projects    Order: 1
```

---

### Test 8: Edit Menu Item ✅

**Goal:** Update menu item

**Steps:**

1. [ ] Click actions (⋮) on "Portfolio"
2. [ ] Click "Edit"
3. [ ] Change title to `My Portfolio`
4. [ ] Change icon to `solar:star-bold-duotone`
5. [ ] Click "Update"
6. [ ] Verify changes

**Expected Result:**

- ✅ Title updated to "My Portfolio"
- ✅ Icon changed to star
- ✅ Changes visible immediately

---

### Test 9: Delete Menu Item ✅

**Goal:** Delete menu item (with confirmation)

**Steps:**

1. [ ] Click actions (⋮) on "React Projects"
2. [ ] Click "Delete"
3. [ ] Confirm deletion
4. [ ] Verify success toast
5. [ ] Item removed from tree

**Expected Result:**

- ✅ Confirmation dialog appears
- ✅ Item deleted successfully
- ✅ Tree updated

---

### Test 10: Delete Parent (Cascade) ✅

**Goal:** Verify cascade delete works

**Steps:**

1. [ ] Click actions (⋮) on "My Portfolio"
2. [ ] Click "Delete"
3. [ ] Confirm deletion
4. [ ] Verify all children deleted too

**Expected Result:**

- ✅ Parent deleted
- ✅ "Web Development" also deleted (cascade)
- ✅ Tree updated correctly

---

### Test 11: Create Complex Nested Menu ✅

**Goal:** Create "Ilmu Islam" menu structure

**Target Structure:**

```
Ilmu Islam
├── Tauhid
├── Fiqh
└── Sirah
    ├── Sahabat
    └── Sahabiyah
```

**Steps:**

1. [ ] Add root: "Ilmu Islam"
2. [ ] Add child: "Tauhid"
3. [ ] Add child: "Fiqh"
4. [ ] Add child: "Sirah"
5. [ ] Add grandchild to Sirah: "Sahabat"
6. [ ] Add grandchild to Sirah: "Sahabiyah"
7. [ ] Verify structure

**Expected Result:**

- ✅ All items created
- ✅ Correct nesting
- ✅ Proper indentation
- ✅ Display order correct

---

### Test 12: Menu Item Types ✅

**Goal:** Test all menu item types

**Create items with each type:**

1. [ ] Category - `/post?category=test`
2. [ ] Post - `/post/test-post`
3. [ ] E-Book - `/ebook/test-ebook`
4. [ ] Page - `/test-page`
5. [ ] Custom - `/custom/path`
6. [ ] External - `https://example.com`

**Expected Result:**

- ✅ All types can be created
- ✅ URLs saved correctly
- ✅ Type badges show correct color

---

### Test 13: Icon & Color Options ✅

**Goal:** Test customization options

**Steps:**

1. [ ] Create item with each icon option (10 icons)
2. [ ] Create item with each color option (6 colors)
3. [ ] Verify icons display correctly
4. [ ] Verify colors apply correctly

**Expected Result:**

- ✅ All 10 icons work
- ✅ All 6 colors work
- ✅ Visual appearance correct

---

### Test 14: Display Order ✅

**Goal:** Test ordering functionality

**Steps:**

1. [ ] Create 3 items with orders: 30, 10, 20
2. [ ] Verify they appear in order: 10, 20, 30
3. [ ] Change order of middle item to 5
4. [ ] Verify new order: 5, 10, 30

**Expected Result:**

- ✅ Items sorted by display_order
- ✅ Lower numbers appear first
- ✅ Order updates work

---

### Test 15: Active/Inactive Toggle ✅

**Goal:** Test visibility control

**Steps:**

1. [ ] Create menu item
2. [ ] Set to inactive
3. [ ] Verify "Inactive" label shows
4. [ ] Toggle to active
5. [ ] Verify label removed

**Expected Result:**

- ✅ Inactive items show label
- ✅ Toggle works
- ✅ Status persists

---

### Test 16: Target Window ✅

**Goal:** Test link target options

**Steps:**

1. [ ] Create item with target: `_self`
2. [ ] Create item with target: `_blank`
3. [ ] Verify saved correctly

**Expected Result:**

- ✅ Both options work
- ✅ Saved to database

---

### Test 17: Delete Menu (with items) ✅

**Goal:** Verify cascade delete for menu

**Steps:**

1. [ ] Go back to menu list
2. [ ] Delete "Test Menu"
3. [ ] Confirm deletion
4. [ ] Verify all items deleted too

**Expected Result:**

- ✅ Menu deleted
- ✅ All menu items deleted (cascade)
- ✅ No orphaned items

---

### Test 18: Public Menu API ✅

**Goal:** Test public menu fetching

**Steps:**

1. [ ] Open browser console
2. [ ] Run:
   ```javascript
   import { getPublicMenu } from 'src/lib/supabase-client';
   const menu = await getPublicMenu('header');
   console.log(menu);
   ```
3. [ ] Verify menu data returned
4. [ ] Check hierarchical structure

**Expected Result:**

- ✅ Menu data fetched
- ✅ Items in tree structure
- ✅ Only active items returned

---

### Test 19: RLS Policies ✅

**Goal:** Verify security policies

**Test as Public (not logged in):**

1. [ ] Can view active menus
2. [ ] Can view active menu items
3. [ ] Cannot create/edit/delete

**Test as Authenticated User:**

1. [ ] Can view all menus
2. [ ] Can view all menu items
3. [ ] Cannot create/edit/delete (if not admin)

**Test as Admin:**

1. [ ] Can view all menus
2. [ ] Can create/edit/delete menus
3. [ ] Can manage menu items

**Expected Result:**

- ✅ Public: Read-only active items
- ✅ User: Read-only all items
- ✅ Admin: Full access

---

### Test 20: Error Handling ✅

**Goal:** Test error scenarios

**Test cases:**

1. [ ] Create menu with duplicate slug
2. [ ] Create item with empty title
3. [ ] Delete non-existent item
4. [ ] Update with invalid data

**Expected Result:**

- ✅ Error messages display
- ✅ Toast notifications show
- ✅ No crashes
- ✅ Data integrity maintained

---

## 📊 Test Results Summary

### ✅ Passed Tests: \_\_\_/20

### ❌ Failed Tests: \_\_\_/20

### ⚠️ Issues Found: \_\_\_

---

## 🐛 Issues Log

| #   | Issue | Severity | Status |
| --- | ----- | -------- | ------ |
| 1   |       |          |        |
| 2   |       |          |        |
| 3   |       |          |        |

---

## 📝 Notes

**Performance:**

- Page load time: \_\_\_ms
- Menu fetch time: \_\_\_ms
- Tree render time: \_\_\_ms

**Browser Compatibility:**

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Mobile Testing:**

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive layout

---

## ✅ Final Checklist

- [ ] All 20 tests passed
- [ ] No critical issues
- [ ] Documentation reviewed
- [ ] Ready for production

---

**Tested By:** ******\_\_\_******
**Date:** ******\_\_\_******
**Version:** 4.0.0
**Status:** ⬜ Pass / ⬜ Fail

---

**Next Steps After Testing:**

1. Fix any issues found
2. Re-test failed cases
3. Deploy to production
4. Monitor for errors

🎉 **Happy Testing!**
