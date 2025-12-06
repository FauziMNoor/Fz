# 🔧 Troubleshoot Create Portfolio Error

**Error:** `createPortfolio error: {}`

---

## 🎯 Quick Fix Steps

### Step 1: Verify Migration Ran

**Open Supabase SQL Editor:**

```
https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql/new
```

**Run Verification Query:**
Copy and run: `VERIFY_PORTFOLIO_TABLE.sql`

**Expected Results:**

```
✅ Table Exists: YES
✅ RLS Enabled: YES
✅ 12+ Columns
✅ 5 RLS Policies
✅ 5+ Indexes
✅ Storage Bucket: portfolio-images
```

---

### Step 2: If Table Missing - Run Migration

**Run Simple Migration:**

```sql
-- Copy and run: supabase_migrations/simple_portfolio_setup.sql
```

**Or run this quick fix:**

```sql
-- Quick create table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'project',
  cover_image TEXT,
  images TEXT[],
  link_url TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Create basic policy
CREATE POLICY "Users can insert own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

### Step 3: Check Browser Console

**Open Browser Console (F12)**

Look for detailed error:

```
createPortfolio called with: { userId: '...', portfolioData: {...} }
Inserting data: {...}
createPortfolio error: {...}
Error details: {...}
```

**Common Errors:**

**1. "null value in column user_id"**

```
Solution: User not logged in
- Check auth.uid() returns value
- Login again
```

**2. "violates foreign key constraint"**

```
Solution: User ID doesn't exist in auth.users
- Check user exists
- Use correct user ID
```

**3. "column does not exist"**

```
Solution: Table schema incomplete
- Run migration again
- Check all columns exist
```

**4. "permission denied"**

```
Solution: RLS policy missing
- Enable RLS
- Create INSERT policy
```

---

### Step 4: Test Insert Manually

**Get Your User ID:**

```sql
SELECT id, email FROM auth.users WHERE email = 'fauzimnoor90@gmail.com';
```

**Try Manual Insert:**

```sql
INSERT INTO public.portfolios (
  user_id,
  title,
  category
) VALUES (
  'bb2e61da-8f0c-4f12-9fef-59f82db50d69', -- Replace with your user ID
  'Test Portfolio',
  'project'
) RETURNING *;
```

**If this works:** Problem is in the form/code
**If this fails:** Problem is in database setup

---

### Step 5: Check Form Data

**Add console.log in form:**

```javascript
const onSubmit = handleSubmit(async (data) => {
  console.log('Form data:', data);
  console.log('User ID:', user?.id);
  console.log('Cover image file:', coverImageFile);

  // ... rest of code
});
```

**Check:**

- [ ] user?.id is not null
- [ ] data.title is not empty
- [ ] data.category is valid
- [ ] All required fields present

---

## 🐛 Common Issues & Solutions

### Issue 1: Empty Error Object `{}`

**Cause:** Network error or CORS issue

**Solution:**

```javascript
// Check network tab in browser
// Look for failed requests
// Check Supabase URL and key in .env
```

### Issue 2: "Failed to create portfolio"

**Cause:** Generic error, need more details

**Solution:**

```javascript
// Check browser console for detailed error
// Look at createPortfolio logs
// Check Supabase logs
```

### Issue 3: Upload works but save fails

**Cause:** Image uploaded but portfolio insert failed

**Solution:**

```javascript
// Check if image URL is valid
// Check if all required fields filled
// Check database constraints
```

---

## 🔍 Debug Checklist

### Database

- [ ] Table `portfolios` exists
- [ ] All columns present (12+)
- [ ] RLS enabled
- [ ] INSERT policy exists
- [ ] User ID valid
- [ ] Foreign key constraint satisfied

### Code

- [ ] User logged in (user?.id not null)
- [ ] Form validation passes
- [ ] Required fields filled
- [ ] Data types correct
- [ ] No undefined values

### Network

- [ ] Supabase URL correct
- [ ] Supabase key correct
- [ ] No CORS errors
- [ ] Network request succeeds

---

## 📊 Verification Queries

### Check User

```sql
SELECT id, email, created_at
FROM auth.users
WHERE email = 'fauzimnoor90@gmail.com';
```

### Check Table Structure

```sql
\d portfolios
```

### Check Policies

```sql
SELECT * FROM pg_policies WHERE tablename = 'portfolios';
```

### Check Recent Errors

```sql
-- Check Supabase logs in dashboard
-- Go to: Logs > Postgres Logs
```

---

## 🚀 Quick Recovery

### If Nothing Works - Reset Table

**⚠️ WARNING: This deletes all data!**

```sql
-- Drop and recreate
DROP TABLE IF EXISTS public.portfolios CASCADE;

-- Then run: simple_portfolio_setup.sql
```

---

## 📞 Get Help

### Check These Files:

1. `VERIFY_PORTFOLIO_TABLE.sql` - Verification queries
2. `SIMPLE_MIGRATION_GUIDE.md` - Migration guide
3. `FIX_MIGRATION_ERROR.md` - Migration errors

### Check Logs:

1. Browser Console (F12)
2. Supabase Dashboard > Logs
3. Network Tab (F12 > Network)

---

## ✅ Success Indicators

When everything works:

```
✅ Console: "createPortfolio called with: {...}"
✅ Console: "Inserting data: {...}"
✅ Console: "createPortfolio success: {...}"
✅ Toast: "Portfolio created successfully!"
✅ Redirect to list page
✅ Portfolio appears in list
```

---

**Version:** 1.5.2
**Last Updated:** 2025-12-05
