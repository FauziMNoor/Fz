# 🐛 Bugfix - usePopover Import Error

**Date:** 2025-12-05
**Status:** FIXED ✅

---

## 🐛 Issue

```
Export usePopover doesn't exist in target module
./src/sections/user/profile-portfolio.jsx (14:1)

The export usePopover was not found in module
[project]/src/components/custom-popover/index.js
```

---

## 🔍 Root Cause

`usePopover` hook is not exported from `src/components/custom-popover/index.js`.

It's actually exported from `minimal-shared/hooks` package.

---

## ✅ Solution

### Before (Incorrect):

```javascript
import { Iconify } from 'src/components/iconify';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
```

### After (Correct):

```javascript
import { usePopover } from 'minimal-shared/hooks';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
```

---

## 📁 File Modified

```
src/sections/user/
└── profile-portfolio.jsx  ✅ Fixed import
```

---

## 🔍 How to Find Correct Import

### Method 1: Search in Codebase

```bash
# Search for usePopover usage
grep -r "usePopover" src/components/
```

### Method 2: Check Other Components

Look at similar components that use popover:

- `src/components/chart/components/chart-select.jsx`
- `src/components/phone-input/list-popover.jsx`
- `src/components/nav-section/horizontal/nav-list.jsx`

All use: `import { usePopover } from 'minimal-shared/hooks';`

---

## 📚 Minimal Shared Hooks

The `minimal-shared` package provides several useful hooks:

```javascript
import {
  usePopover, // ✅ For popover state management
  usePopoverHover, // For hover-triggered popovers
  useBoolean, // For boolean state
  useSetState, // For object state
  // ... and more
} from 'minimal-shared/hooks';
```

---

## ✅ Verification

### Check Import:

```javascript
// ✅ Correct
import { usePopover } from 'minimal-shared/hooks';

// ❌ Wrong
import { usePopover } from 'src/components/custom-popover';
```

### Test Component:

1. Start dev server: `yarn dev`
2. Navigate to portfolio page
3. No import errors in console
4. Component renders correctly

---

## 🎯 Related Components

Other components using `usePopover`:

| Component            | Import                    |
| -------------------- | ------------------------- |
| ChartSelect          | `minimal-shared/hooks` ✅ |
| ListPopover          | `minimal-shared/hooks` ✅ |
| NavList (Horizontal) | `minimal-shared/hooks` ✅ |
| NavList (Mini)       | `minimal-shared/hooks` ✅ |
| ProfilePortfolio     | `minimal-shared/hooks` ✅ |

---

## 💡 Best Practice

When using hooks from Minimal UI template:

1. **Check package first:** `minimal-shared/hooks`
2. **Then check local:** `src/hooks`
3. **Search codebase:** Find similar usage
4. **Read docs:** Check Minimal UI documentation

---

## 🧪 Testing

### Before Fix:

```
❌ Import error
❌ Component doesn't render
❌ Page crashes
```

### After Fix:

```
✅ No import errors
✅ Component renders
✅ Popover works correctly
✅ Edit/Delete menu functional
```

---

**Version:** 1.4.1
**Last Updated:** 2025-12-05
**Status:** ✅ Fixed
