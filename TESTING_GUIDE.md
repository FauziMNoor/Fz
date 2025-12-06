# 🧪 Testing Guide - Portfolio System

**Quick guide untuk test Portfolio System di browser**

---

## 🚀 Start Development Server

```bash
yarn dev
```

Wait for: `✓ Ready on http://localhost:3032`

---

## 📍 Test Locations

### 1. Public About Page

**URL:** http://localhost:3032/tentang-saya?tab=portfolio

**What to expect:**

- ✅ "Portfolio" tab visible
- ✅ Category filter buttons (All, Projects, Presentations, Achievements, Publications)
- ✅ Empty state: "No portfolio items yet"
- ✅ No edit/delete menu (isOwner=false)
- ✅ No console errors

### 2. Dashboard User Page

**URL:** http://localhost:3032/dashboard/user?tab=portfolio

**What to expect:**

- ✅ "Portfolio" tab visible
- ✅ Category filter buttons
- ✅ Empty state: "No portfolio items yet"
- ✅ Edit/Delete menu will show when data exists (isOwner=true)
- ✅ No console errors

---

## 🎯 Visual Checklist

### Both Pages Should Show:

```
┌────────────────────────────────────────────────────────┐
│  [All] [Projects] [Presentations] [Achievements] [...]  │  ← Filter buttons
├────────────────────────────────────────────────────────┤
│                                                        │
│                    ┌─────────┐                        │
│                    │   📁    │                        │  ← Icon
│                    └─────────┘                        │
│                                                        │
│              No portfolio items yet                    │  ← Message
│                                                        │
│     Start adding your projects, presentations,         │
│            and achievements                            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🔍 Browser Console Check

Open browser console (F12) and verify:

```
✅ No red errors
✅ No warnings about missing components
✅ No 404 errors
✅ No import errors
```

---

## 📱 Responsive Test

### Desktop (1920px)

- Filter buttons in single row
- 3 columns for cards (when data exists)

### Tablet (768px)

- Filter buttons may wrap
- 2 columns for cards

### Mobile (375px)

- Filter buttons scrollable
- 1 column for cards

---

## 🎨 Tab Navigation Test

### Test on Public Page:

1. Click "Profile" tab → Should show profile info
2. Click "Followers" tab → Should show followers
3. Click "Friends" tab → Should show friends
4. Click "Portfolio" tab → Should show portfolio ✅
5. Verify URL changes to `?tab=portfolio`

### Test on Dashboard Page:

1. Click "Profile" tab → Should show profile info
2. Click "Followers" tab → Should show followers
3. Click "Friends" tab → Should show friends
4. Click "Portfolio" tab → Should show portfolio ✅
5. Verify URL changes to `?tab=portfolio`

---

## 🗄️ Database Test (After Migration)

### Add Sample Data:

1. Open Supabase SQL Editor:

   ```
   https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql/new
   ```

2. Get your user ID:

   ```sql
   SELECT id FROM auth.users WHERE email = 'fauzimnoor90@gmail.com';
   ```

3. Insert sample portfolio:

   ```sql
   INSERT INTO public.portfolios (
     user_id,
     title,
     description,
     category,
     cover_image,
     tags,
     featured,
     is_published
   ) VALUES (
     'YOUR_USER_ID_HERE',
     'Sample Project',
     'This is a test portfolio item',
     'project',
     'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
     ARRAY['test', 'sample'],
     true,
     true
   );
   ```

4. Refresh portfolio page
5. Should see portfolio card!

---

## ✅ Expected Results

### Empty State (Before Adding Data):

- ✅ Icon shows
- ✅ Message shows
- ✅ Filter buttons work (no errors)
- ✅ No console errors

### With Data (After Adding Sample):

- ✅ Portfolio card displays
- ✅ Cover image shows
- ✅ Category badge shows
- ✅ Title & description show
- ✅ Tags show
- ✅ Featured star shows (if featured=true)
- ✅ Edit menu shows on dashboard (⋮)
- ✅ No edit menu on public page

---

## 🐛 Common Issues

### Issue: "Portfolio" tab not showing

**Check:**

- Browser cache cleared?
- Development server restarted?
- File saved correctly?

**Solution:**

```bash
# Stop server (Ctrl+C)
# Restart
yarn dev
```

### Issue: Empty state not showing

**Check:**

- Console for errors?
- Component imported correctly?
- No syntax errors?

**Solution:**

- Check browser console
- Verify `ProfilePortfolio` import

### Issue: Page shows old "Gallery" tab

**Check:**

- File saved?
- Browser cache?
- Correct URL?

**Solution:**

- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache

---

## 📊 Performance Check

### Page Load Time:

- ✅ Should load in < 2 seconds
- ✅ No layout shift
- ✅ Smooth transitions

### Filter Buttons:

- ✅ Click response instant
- ✅ Active state changes
- ✅ No lag

---

## 🎯 Next Test (Phase 3)

After creating portfolio management:

1. **Create Portfolio:**

   - Navigate to `/dashboard/portfolio/new`
   - Fill form
   - Upload image
   - Save

2. **View Portfolio:**

   - Check dashboard page
   - Check public page
   - Verify data displays

3. **Edit Portfolio:**

   - Click edit (⋮ menu)
   - Update data
   - Save changes

4. **Delete Portfolio:**
   - Click delete (⋮ menu)
   - Confirm deletion
   - Verify removed

---

## 📸 Screenshot Checklist

Take screenshots of:

- [ ] Public page - Portfolio tab
- [ ] Dashboard page - Portfolio tab
- [ ] Empty state
- [ ] With sample data (after adding)
- [ ] Mobile view
- [ ] Tablet view
- [ ] Desktop view

---

## ✅ Final Checklist

Before marking as complete:

- [ ] Both pages tested (public & dashboard)
- [ ] All tabs work correctly
- [ ] Portfolio tab shows empty state
- [ ] Filter buttons render
- [ ] No console errors
- [ ] Responsive design works
- [ ] URL changes correctly
- [ ] Browser cache cleared
- [ ] Development server running

---

**Testing Date:** ******\_******
**Tested By:** ******\_******
**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Complete
**Issues Found:** **********************\_**********************

---

**Version:** 1.4.1
**Last Updated:** 2025-12-05
