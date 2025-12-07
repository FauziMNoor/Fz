# 🧪 Test Category Management - Quick Guide

## ✅ Status: Ready to Test!

Category Management page sudah **working** dan siap untuk ditest!

**URL:** http://localhost:3032/dashboard/ebook/categories

---

## 🚀 Quick Test (5 Menit)

### Step 1: Access Category Page

1. **Open Browser**

   - Go to: http://localhost:3032/dashboard/ebook/categories

2. **Login** (jika belum)

   - Email: `fauzimnoor90@gmail.com`
   - Password: `password123`

3. **You Should See:**
   - Page title: "E-Book Categories"
   - Button: "New Category"
   - Table dengan 6 default categories:
     1. Tauhid & Aqidah
     2. Fiqh
     3. Sirah Nabawiyah
     4. Pendidikan
     5. Kepemimpinan
     6. Pengembangan Diri

---

### Step 2: Create New Category

1. **Click "New Category" Button**

2. **Fill Form:**

   - **Name:** `Akhlak & Adab`
   - **Slug:** `akhlak-adab` (auto-generated)
   - **Description:** `E-book tentang akhlak dan adab Islam`
   - **Icon:** Select `Heart`
   - **Color:** Select `Purple`
   - **Display Order:** `7`

3. **Click "Create"**

4. **Expected Result:**
   - ✅ Success toast: "Category created successfully!"
   - ✅ New category appears in table
   - ✅ Category has heart icon & purple color

---

### Step 3: Edit Category

1. **Find Category** "Akhlak & Adab" in table

2. **Click "..." Menu** (3 dots)

3. **Click "Edit"**

4. **Change:**

   - **Icon:** Change to `Star`
   - **Color:** Change to `Orange`

5. **Click "Update"**

6. **Expected Result:**
   - ✅ Success toast: "Category updated successfully!"
   - ✅ Icon changed to star
   - ✅ Color changed to orange

---

### Step 4: Test Delete Validation

1. **Try to Delete** "Tauhid & Aqidah" (default category)

2. **Click "..." Menu** → **"Delete"**

3. **Click "Delete" in Confirmation**

4. **Expected Result:**
   - ✅ Error toast: "Cannot delete category. X e-book(s) are using this category."
   - ✅ Category NOT deleted (jika ada e-book yang pakai)
   - OR
   - ✅ Success toast: "Category deleted successfully!" (jika tidak ada e-book)

---

### Step 5: Delete Unused Category

1. **Delete** "Akhlak & Adab" (yang baru dibuat)

2. **Click "..." Menu** → **"Delete"**

3. **Confirm Deletion**

4. **Expected Result:**
   - ✅ Success toast: "Category deleted successfully!"
   - ✅ Category removed from table
   - ✅ Table refreshed

---

## ✅ Test Checklist

### Basic Functions

- [ ] Page loads successfully
- [ ] Table shows 6 default categories
- [ ] Icons displayed correctly
- [ ] Colors displayed correctly

### Create Category

- [ ] "New Category" button works
- [ ] Dialog opens
- [ ] Form validation works
- [ ] Slug auto-generated from name
- [ ] Icon dropdown works
- [ ] Color dropdown works
- [ ] Create button works
- [ ] Success toast appears
- [ ] New category appears in table

### Edit Category

- [ ] Edit menu works
- [ ] Dialog opens with pre-filled data
- [ ] Can change all fields
- [ ] Update button works
- [ ] Success toast appears
- [ ] Changes reflected in table

### Delete Category

- [ ] Delete menu works
- [ ] Confirmation dialog appears
- [ ] Validation works (cannot delete if used)
- [ ] Delete button works
- [ ] Success toast appears
- [ ] Category removed from table

### UI/UX

- [ ] Table sorting works
- [ ] Pagination works (if > 10 categories)
- [ ] Responsive design works
- [ ] Icons preview works
- [ ] Colors preview works
- [ ] Loading states work

---

## 🎯 Test Scenarios

### Scenario 1: Create Islamic Category

**Goal:** Add "Akhlak & Adab" category

**Steps:**

1. Click "New Category"
2. Name: `Akhlak & Adab`
3. Description: `E-book tentang akhlak dan adab Islam`
4. Icon: `Heart`
5. Color: `Purple`
6. Order: `7`
7. Click "Create"

**Expected:**

- ✅ Category created
- ✅ Appears in table
- ✅ Available in e-book form dropdown

### Scenario 2: Reorder Categories

**Goal:** Make "Pendidikan" appear first

**Steps:**

1. Edit "Pendidikan"
2. Change Display Order from `4` to `1`
3. Edit other categories, increase their order
4. Save

**Expected:**

- ✅ "Pendidikan" appears first in list
- ✅ Other categories reordered

### Scenario 3: Change Category Appearance

**Goal:** Change "Fiqh" icon & color

**Steps:**

1. Edit "Fiqh"
2. Change Icon to `Document`
3. Change Color to `Blue`
4. Save

**Expected:**

- ✅ Icon changed
- ✅ Color changed
- ✅ Changes visible everywhere

### Scenario 4: Delete Unused Category

**Goal:** Remove test category

**Steps:**

1. Create test category
2. Don't use it in any e-book
3. Delete it
4. Confirm

**Expected:**

- ✅ Category deleted
- ✅ No errors

### Scenario 5: Try Delete Used Category

**Goal:** Test validation

**Steps:**

1. Create e-book with category "Tauhid"
2. Try to delete "Tauhid" category
3. Confirm

**Expected:**

- ✅ Error message
- ✅ Category NOT deleted
- ✅ E-book still has category

---

## 🐛 Common Issues & Solutions

### Issue 1: Page Not Loading

**Solution:**

- Check dev server running
- Check login status
- Clear browser cache

### Issue 2: Categories Not Showing

**Solution:**

- Run database migration first
- Check Supabase connection
- Check RLS policies

### Issue 3: Cannot Create Category

**Solution:**

- Check all required fields filled
- Check slug is unique
- Check Supabase permissions

### Issue 4: Cannot Delete Category

**Solution:**

- Check if category is used by e-books
- Remove e-books first
- Then delete category

---

## 📊 Expected Data

### Default Categories (6)

| Name              | Slug            | Icon       | Color  | Order |
| ----------------- | --------------- | ---------- | ------ | ----- |
| Tauhid & Aqidah   | tauhid-aqidah   | Mosque     | Purple | 1     |
| Fiqh              | fiqh            | Book       | Green  | 2     |
| Sirah Nabawiyah   | sirah           | History    | Cyan   | 3     |
| Pendidikan        | pendidikan      | Graduation | Orange | 4     |
| Kepemimpinan      | kepemimpinan    | Crown      | Violet | 5     |
| Pengembangan Diri | pengembangan... | Star       | Green  | 6     |

---

## 🎉 Success Criteria

### All Tests Pass If:

- ✅ Can create new category
- ✅ Can edit existing category
- ✅ Can delete unused category
- ✅ Cannot delete used category (validation works)
- ✅ Icons display correctly
- ✅ Colors display correctly
- ✅ Slug auto-generated
- ✅ Table updates after changes
- ✅ Toast notifications work
- ✅ No console errors

---

## 📝 Test Report Template

```
Date: _____________
Tester: ___________

✅ Page loads successfully
✅ Create category works
✅ Edit category works
✅ Delete category works
✅ Validation works
✅ Icons display correctly
✅ Colors display correctly
✅ UI/UX smooth

Issues Found:
- None / [List issues]

Overall Status: PASS / FAIL

Notes:
_______________________
```

---

## 🚀 Next Steps After Testing

### If All Tests Pass:

1. ✅ Start creating custom categories
2. ✅ Organize your e-books
3. ✅ Set appropriate icons & colors
4. ✅ Reorder categories as needed

### If Issues Found:

1. 📝 Document the issue
2. 🔍 Check console for errors
3. 📸 Take screenshot
4. 💬 Report to developer

---

## 📚 Related Documentation

- **EBOOK_CATEGORY_MANAGEMENT.md** - Full category guide
- **EBOOK_FINAL_SUMMARY.md** - Complete system summary
- **START_HERE_EBOOK.md** - Quick start guide

---

**Test URL:** http://localhost:3032/dashboard/ebook/categories

**Status:** ✅ Ready to Test

**Good luck testing! 🧪**
