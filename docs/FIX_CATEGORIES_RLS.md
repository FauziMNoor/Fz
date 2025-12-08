# 🔧 Fix Categories RLS Policy

**Issue:** Error 403 (Forbidden) when creating/updating/deleting categories.

**Error Message:**

```
new row violates row-level security policy for table "categories"
```

## 🔍 Root Cause

The `categories` table only has SELECT policy (read-only). Missing policies for:

- ❌ INSERT (create)
- ❌ UPDATE (edit)
- ❌ DELETE (remove)

## ✅ Solution

Run the migration to add missing RLS policies.

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run Migration

Copy and paste the entire content of:

```
supabase_migrations/fix_categories_rls.sql
```

Then click **Run** or press `Ctrl+Enter`

### Step 3: Verify

You should see output showing 4 policies created:

- ✅ Anyone can view categories (SELECT)
- ✅ Authenticated users can create categories (INSERT)
- ✅ Authenticated users can update categories (UPDATE)
- ✅ Authenticated users can delete categories (DELETE)

## 🎯 What This Fixes

After running this migration, authenticated users can:

- ✅ View all categories (public access)
- ✅ Create new categories
- ✅ Update existing categories
- ✅ Delete categories (if not used by posts)

## 🔒 Security

- Public users: Can only VIEW categories
- Authenticated users: Can CREATE, UPDATE, DELETE categories
- RLS is still enabled for security

## 📝 Test

After migration, try:

1. Go to `/dashboard/post/categories`
2. Click "Create Category"
3. Fill in the form
4. Click "Save"
5. Should work without 403 error! ✅

---

**Migration File:** `supabase_migrations/fix_categories_rls.sql`
**Date:** December 8, 2025
