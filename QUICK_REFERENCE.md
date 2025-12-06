# 🚀 Quick Reference - Portfolio System

## 📦 What Was Built

✅ **8 Database Tables** (portfolios, user_posts, likes, comments, achievements, certifications, experiences, timeline)
✅ **20+ Helper Functions** (CRUD operations for all tables)
✅ **1 UI Component** (ProfilePortfolio with category filter)
✅ **1 Page Update** (Gallery → Portfolio tab)
✅ **1 Storage Bucket** (portfolio-images)

---

## ⚡ Quick Deploy (5 Minutes)

### 1. Run SQL Migrations

```
Open: https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql/new

Copy & Run: supabase_migrations/create_portfolios_table.sql
Copy & Run: supabase_migrations/create_profile_extensions_complete.sql
```

### 2. Test App

```bash
yarn dev
# Visit: http://localhost:3032/tentang-saya?tab=portfolio
```

### 3. Add Sample Data (Optional)

```sql
-- Get your user ID first
SELECT id FROM auth.users WHERE email = 'fauzimnoor90@gmail.com';

-- Insert sample portfolio
INSERT INTO public.portfolios (user_id, title, description, category, cover_image, tags, featured, is_published)
VALUES (
  'YOUR_USER_ID_HERE',
  'Sample Project',
  'This is a sample portfolio item',
  'project',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
  ARRAY['sample', 'test'],
  true,
  true
);
```

---

## 📂 File Locations

### Database Migrations

```
supabase_migrations/
├── create_portfolios_table.sql
└── create_profile_extensions_complete.sql
```

### Code Files

```
src/lib/supabase-client.js              (Helper functions)
src/sections/user/profile-portfolio.jsx (UI component)
src/sections/about/view/about-view.jsx  (Updated page)
```

### Documentation

```
DEPLOYMENT_INSTRUCTIONS.md    (Step-by-step guide)
PORTFOLIO_IMPLEMENTATION.md   (Technical details)
PHASE_1_2_SUMMARY.md         (Complete overview)
QUICK_REFERENCE.md           (This file)
```

---

## 🎯 Portfolio Categories

| Category     | Icon | Color           |
| ------------ | ---- | --------------- |
| project      | 💻   | Primary (Ungu)  |
| presentation | 📊   | Secondary       |
| achievement  | 🏆   | Success (Hijau) |
| publication  | 📄   | Info (Cyan)     |

---

## 💻 Code Snippets

### Fetch Portfolios

```javascript
import { getUserPortfolios } from 'src/lib/supabase-client';

const portfolios = await getUserPortfolios(userId);
```

### Create Portfolio

```javascript
import { createPortfolio } from 'src/lib/supabase-client';

const newPortfolio = await createPortfolio(userId, {
  title: 'My Project',
  description: 'Description here',
  category: 'project',
  cover_image: 'https://...',
  tags: ['tag1', 'tag2'],
  featured: true,
  is_published: true,
});
```

### Use Component

```javascript
import { ProfilePortfolio } from 'src/sections/user/profile-portfolio';

<ProfilePortfolio
  portfolios={portfolios}
  isOwner={true}
  onEdit={(portfolio) => console.log('Edit:', portfolio)}
  onDelete={(portfolio) => console.log('Delete:', portfolio)}
/>;
```

---

## 🔍 Verify Deployment

### Check Tables

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('portfolios', 'user_posts', 'post_likes', 'post_comments', 'achievements', 'certifications', 'teaching_experiences', 'career_timeline');
```

### Check RLS Policies

```sql
SELECT * FROM pg_policies WHERE tablename = 'portfolios';
```

### Check Storage

```sql
SELECT * FROM storage.buckets WHERE id = 'portfolio-images';
```

---

## 🐛 Common Issues

### "relation 'portfolios' does not exist"

→ Run migrations again

### "permission denied for table portfolios"

→ Enable RLS: `ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;`

### Storage bucket not found

→ Create manually in Supabase Dashboard > Storage

### Can't upload images

→ Check storage policies in migration file

---

## 📱 Test URLs

- **Portfolio Tab:** http://localhost:3032/tentang-saya?tab=portfolio
- **Supabase Dashboard:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc
- **Database Editor:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/editor
- **Storage:** https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/storage/buckets

---

## 🎯 Next Phase

**Phase 3: Portfolio Management Dashboard**

Create:

- `/dashboard/portfolio` - List view
- `/dashboard/portfolio/new` - Create form
- `/dashboard/portfolio/[id]/edit` - Edit form

Features:

- Image upload to Supabase Storage
- Rich form with validation
- Preview mode
- Drag & drop reordering

---

## 📞 Need Help?

1. Check browser console for errors
2. Review `DEPLOYMENT_INSTRUCTIONS.md`
3. See `PORTFOLIO_IMPLEMENTATION.md` for technical details
4. Check `mulai_dari_sini.md` for project overview

---

**Version:** 1.4.0
**Date:** 2025-12-05
**Status:** ✅ Ready for Deployment
