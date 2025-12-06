# 📁 Supabase Migrations

This folder contains SQL migration files for the Portfolio System.

---

## 📋 Migration Files

### 1. `create_portfolios_table.sql`

**Purpose:** Create portfolios table and storage bucket

**Creates:**

- ✅ `portfolios` table (main portfolio items)
- ✅ 5 indexes for performance
- ✅ 1 trigger for auto-update timestamps
- ✅ 5 RLS policies for security
- ✅ `portfolio-images` storage bucket
- ✅ 4 storage policies

**Run Order:** 1st

---

### 2. `create_profile_extensions_complete.sql`

**Purpose:** Create profile extension tables (posts, achievements, etc.)

**Creates:**

- ✅ `user_posts` table (social media style feeds)
- ✅ `post_likes` table (like system)
- ✅ `post_comments` table (comment system)
- ✅ `achievements` table (user achievements)
- ✅ `certifications` table (professional certifications)
- ✅ `teaching_experiences` table (teaching history)
- ✅ `career_timeline` table (career milestones)
- ✅ 6 triggers for auto-update timestamps
- ✅ RLS policies for all tables

**Run Order:** 2nd

---

### 3. Other Migration Files (Existing)

These files were created in previous versions:

- `add_profile_fields.sql` - Added profile fields
- `create_profile_extensions.sql` - Initial profile extensions
- `create_profile_extensions_triggers_rls.sql` - Triggers and RLS
- `setup_storage.sql` - Storage buckets setup
- `update_social_links.sql` - Social media links update

---

## 🚀 How to Run Migrations

### Option A: Supabase Dashboard (Recommended)

1. Open SQL Editor:

   ```
   https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql/new
   ```

2. Copy content from migration file

3. Paste into SQL Editor

4. Click "Run"

5. Verify "Success" message

### Option B: Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref nvppnowugnjfvquvibqc

# Push migrations
supabase db push
```

---

## ✅ Verification Queries

### Check Tables

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'portfolios',
  'user_posts',
  'post_likes',
  'post_comments',
  'achievements',
  'certifications',
  'teaching_experiences',
  'career_timeline'
);
```

### Check RLS Policies

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN (
  'portfolios',
  'user_posts',
  'post_likes',
  'post_comments'
)
ORDER BY tablename, cmd;
```

### Check Indexes

```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'portfolios';
```

### Check Triggers

```sql
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table IN (
  'portfolios',
  'user_posts',
  'achievements'
)
ORDER BY event_object_table;
```

### Check Storage Buckets

```sql
SELECT id, name, public
FROM storage.buckets
WHERE id IN ('avatars', 'post-images', 'portfolio-images');
```

### Check Storage Policies

```sql
SELECT bucket_id, name
FROM storage.policies
WHERE bucket_id = 'portfolio-images';
```

---

## 🐛 Troubleshooting

### Error: "relation already exists"

**Solution:** Table already created. Skip or drop table first.

```sql
DROP TABLE IF EXISTS portfolios CASCADE;
```

### Error: "permission denied"

**Solution:** RLS not enabled. Enable RLS:

```sql
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
```

### Error: "bucket already exists"

**Solution:** Bucket already created. Skip or check in Storage UI.

### Error: "function does not exist"

**Solution:** Run trigger function creation first:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 Migration History

| Version   | Date           | File                                       | Description                     |
| --------- | -------------- | ------------------------------------------ | ------------------------------- |
| 1.0.0     | 2025-12-03     | add_profile_fields.sql                     | Added profile fields            |
| 1.1.0     | 2025-12-03     | create_profile_extensions.sql              | Profile extensions              |
| 1.2.0     | 2025-12-03     | create_profile_extensions_triggers_rls.sql | Triggers & RLS                  |
| 1.2.0     | 2025-12-03     | setup_storage.sql                          | Storage setup                   |
| 1.3.0     | 2025-12-03     | update_social_links.sql                    | Social links update             |
| **1.4.0** | **2025-12-05** | **create_portfolios_table.sql**            | **Portfolio system**            |
| **1.4.0** | **2025-12-05** | **create_profile_extensions_complete.sql** | **Profile extensions complete** |

---

## 📝 Best Practices

1. **Always backup** before running migrations
2. **Test in development** first
3. **Run migrations in order**
4. **Verify after each migration**
5. **Keep migration files** for reference
6. **Document changes** in changelog

---

## 🔗 Related Documentation

- **Deployment Guide:** `../DEPLOYMENT_INSTRUCTIONS.md`
- **Implementation Guide:** `../PORTFOLIO_IMPLEMENTATION.md`
- **Quick Reference:** `../QUICK_REFERENCE.md`
- **Architecture:** `../PORTFOLIO_ARCHITECTURE.md`

---

**Last Updated:** 2025-12-05
**Version:** 1.4.0
