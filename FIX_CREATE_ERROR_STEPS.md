# 🔧 Fix Create Portfolio Error - Step by Step

**Error:** `createPortfolio error: {}`

---

## 🎯 Follow These Steps IN ORDER

### Step 1: Open Browser Console

1. Open your browser (Chrome/Edge/Firefox)
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Keep this open while testing

---

### Step 2: Test Database Connection

1. **Open Supabase SQL Editor:**

   ```
   https://supabase.com/dashboard/project/nvppnowugnjfvquvibqc/sql/new
   ```

2. **Run this query:**

   ```sql
   SELECT EXISTS (
     SELECT 1 FROM information_schema.tables
     WHERE table_name = 'portfolios'
   ) as table_exists;
   ```

3. **Check result:**
   - ✅ If `true`: Table exists, go to Step 3
   - ❌ If `false`: Table missing, go to Step 2B

---

### Step 2B: Create Table (If Missing)

**Run this in Supabase SQL Editor:**

```sql
-- Create portfolios table
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

-- Create policies
DROP POLICY IF EXISTS "Users can view own portfolios" ON public.portfolios;
CREATE POLICY "Users can view own portfolios"
  ON public.portfolios FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own portfolios" ON public.portfolios;
CREATE POLICY "Users can insert own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own portfolios" ON public.portfolios;
CREATE POLICY "Users can update own portfolios"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own portfolios" ON public.portfolios;
CREATE POLICY "Users can delete own portfolios"
  ON public.portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- Verify
SELECT 'Table created successfully!' as status;
```

**After running, go back to Step 2 to verify.**

---

### Step 3: Get Your User ID

**Run this in Supabase SQL Editor:**

```sql
SELECT id, email FROM auth.users WHERE email = 'fauzimnoor90@gmail.com';
```

**Copy the `id` value** (example: `bb2e61da-8f0c-4f12-9fef-59f82db50d69`)

---

### Step 4: Test Manual Insert

**Run this in Supabase SQL Editor:**

```sql
-- Replace YOUR_USER_ID with the ID from Step 3
INSERT INTO public.portfolios (
  user_id,
  title,
  category
) VALUES (
  'bb2e61da-8f0c-4f12-9fef-59f82db50d69', -- Your user ID here
  'Test Portfolio',
  'project'
) RETURNING *;
```

**Check result:**

- ✅ If returns data: Database is working! Go to Step 5
- ❌ If error: Read error message and fix

**Common errors:**

- "null value in column user_id" → User ID wrong
- "permission denied" → RLS policy missing
- "violates foreign key" → User doesn't exist

---

### Step 5: Test in Application

1. **Refresh your browser** (Ctrl+R)
2. **Navigate to:** http://localhost:3032/dashboard/portfolio/new
3. **Open Console** (F12)
4. **Fill the form:**
   - Title: "My First Portfolio"
   - Category: Project
   - Description: "Test description"
5. **Click "Create Portfolio"**

6. **Check Console Output:**

**Expected logs:**

```
=== FORM SUBMIT START ===
Form data: {...}
User ID: bb2e61da-8f0c-4f12-9fef-59f82db50d69
Creating portfolio...
Calling createPortfolio with userId: bb2e61da-8f0c-4f12-9fef-59f82db50d69
createPortfolio called with: {...}
Inserting data: {...}
createPortfolio success: {...}
```

**If you see error:**

```
createPortfolio error: {...}
Error details: {...}
```

**Copy the error details and check:**

- What does the error say?
- Is user_id null?
- Are required fields missing?

---

### Step 6: Common Fixes

**Error: "user_id is null"**

```
Solution: User not logged in
1. Logout
2. Login again
3. Try create portfolio again
```

**Error: "relation portfolios does not exist"**

```
Solution: Table not created
1. Go back to Step 2B
2. Run create table query
3. Try again
```

**Error: "permission denied for table portfolios"**

```
Solution: RLS policy missing
1. Run this:

DROP POLICY IF EXISTS "Users can insert own portfolios" ON public.portfolios;
CREATE POLICY "Users can insert own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

2. Try again
```

**Error: Empty object `{}`**

```
Solution: Check Supabase connection
1. Check .env file
2. Verify NEXT_PUBLIC_SUPABASE_URL
3. Verify NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Restart dev server
```

---

### Step 7: Clean Up Test Data

**After successful test, clean up:**

```sql
DELETE FROM public.portfolios WHERE title = 'Test Portfolio';
```

---

## 📋 Checklist

Before asking for help, verify:

- [ ] Table `portfolios` exists (Step 2)
- [ ] User ID is valid (Step 3)
- [ ] Manual insert works (Step 4)
- [ ] User is logged in
- [ ] Console shows detailed logs (Step 5)
- [ ] .env file has correct Supabase credentials
- [ ] Dev server restarted after .env changes

---

## 🆘 Still Not Working?

**Share these details:**

1. **Step 2 result:** Table exists? (true/false)
2. **Step 3 result:** User ID found? (yes/no)
3. **Step 4 result:** Manual insert works? (yes/no)
4. **Step 5 console logs:** Copy all logs from console
5. **Error message:** Exact error from console

---

## ✅ Success!

When it works, you'll see:

```
✅ Toast: "Portfolio created successfully!"
✅ Redirect to list page
✅ Portfolio appears in list
```

---

**Start with Step 1 and follow in order!**

**Version:** 1.5.2
**Last Updated:** 2025-12-05
