# 🎨 Auth Sign-In Customization

**Date:** December 7, 2025
**Status:** ✅ **COMPLETED**

---

## 📋 Changes Made

### 1. **Sidebar Text - Personalized Welcome Message**

**Changed:**

- Title: "Hi, Welcome back" → **"Selamat Datang Kembali"**
- Subtitle: "More effectively with optimized workflows." → **"Mari lanjutkan amanah dan kerja terbaik kita dengan penuh keberkahan."**

**File:** `src/app/auth/supabase/sign-in/layout.jsx`

```jsx
// Before
slotProps={{
  section: { title: 'Hi, Welcome back' },
}}

// After
slotProps={{
  section: {
    title: 'Selamat Datang Kembali',
    subtitle: 'Mari lanjutkan amanah dan kerja terbaik kita dengan penuh keberkahan.'
  },
}}
```

---

### 2. **Removed "Don't have an account?" Text**

**Removed:**

- Description text: "Don't have an account? Get started"
- Link to sign-up page

**File:** `src/auth/view/supabase/supabase-sign-in-view.jsx`

```jsx
// Before
<FormHead
  title="Sign in to your account"
  description={
    <>
      {`Don't have an account? `}
      <Link component={RouterLink} href={paths.auth.supabase.signUp}>
        Get started
      </Link>
    </>
  }
/>

// After
<FormHead
  title="Sign in to your account"
  sx={{ textAlign: { xs: 'center', md: 'left' } }}
/>
```

---

### 3. **Image Size Adjustment**

**Increased:**

- maxHeight: `60vh` → `75vh`
- Added minHeight: `400px`

**File:** `src/layouts/auth-split/section.jsx`

```jsx
sx={{
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
  minHeight: '400px',
  maxHeight: '75vh',
  objectFit: 'contain',
  objectPosition: 'center',
}}
```

---

## ✅ Result

### Sidebar (Left Side):

- ✅ **Title:** "Selamat Datang Kembali"
- ✅ **Subtitle:** "Mari lanjutkan amanah dan kerja terbaik kita dengan penuh keberkahan."
- ✅ **Image:** Larger and fully visible
- ✅ **Icons:** Removed (clean sidebar)

### Form (Right Side):

- ✅ **Title:** "Sign in to your account"
- ✅ **Description:** Removed (cleaner UI)
- ✅ **Form:** Email, Password, Sign in button

### Header:

- ✅ **"Need help?":** Removed
- ✅ **Settings button:** Kept

---

## 📁 Files Modified

1. `src/app/auth/supabase/sign-in/layout.jsx` - Sidebar text customization
2. `src/auth/view/supabase/supabase-sign-in-view.jsx` - Removed description
3. `src/layouts/auth-split/section.jsx` - Image size adjustment
4. `src/layouts/auth-split/layout.jsx` - Removed "Need help?" & auth icons

---

## 🎯 Impact

- **Personalized:** Welcome message sesuai identitas (amanah & keberkahan)
- **Cleaner UI:** Removed unnecessary text and links
- **Better Visual:** Image lebih besar dan seimbang
- **Focused:** User fokus ke login form

---

**Completed By:** Kiro AI Assistant
**Date:** December 7, 2025
