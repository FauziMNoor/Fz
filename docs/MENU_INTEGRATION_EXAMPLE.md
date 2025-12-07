# 🔗 Menu Builder - Frontend Integration Examples

## 📋 Overview

Panduan ini menunjukkan cara mengintegrasikan Menu Builder dengan frontend navigation untuk menggantikan static menu dengan dynamic menu dari database.

---

## 🎯 Integration Options

### Option 1: Server-Side (Recommended)

Fetch menu di server-side untuk better SEO & performance

### Option 2: Client-Side

Fetch menu di client-side untuk dynamic updates

### Option 3: Hybrid

Static fallback + dynamic updates

---

## 🚀 Option 1: Server-Side Integration

### Step 1: Create Server Action

**File:** `src/actions/menu-ssr.js`

```javascript
'use server';

import { getPublicMenu } from 'src/lib/supabase-client';

/**
 * Get menu data for SSR
 */
export async function getMenuData(location = 'header') {
  try {
    const menu = await getPublicMenu(location);
    return menu;
  } catch (error) {
    console.error('Error fetching menu:', error);
    return null;
  }
}

/**
 * Transform menu items to nav format
 */
export function transformMenuToNav(menu) {
  if (!menu || !menu.items) return [];

  return menu.items.map((item) => ({
    title: item.title,
    path: item.url,
    icon: item.icon,
    children: item.children?.map((child) => ({
      title: child.title,
      path: child.url,
    })),
  }));
}
```

### Step 2: Update Layout Component

**File:** `src/layouts/main/layout.jsx`

```javascript
import { getMenuData, transformMenuToNav } from 'src/actions/menu-ssr';
import { Header } from './header';

export async function MainLayout({ children }) {
  // Fetch menu from database
  const menu = await getMenuData('header');
  const navData = transformMenuToNav(menu);

  return (
    <>
      <Header navData={navData} />
      <main>{children}</main>
    </>
  );
}
```

### Step 3: Update Header Component

**File:** `src/layouts/main/header.jsx`

```javascript
'use client';

import { Iconify } from 'src/components/iconify';

export function Header({ navData }) {
  return (
    <header>
      <nav>
        {navData.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </nav>
    </header>
  );
}

function NavItem({ item }) {
  return (
    <div>
      <a href={item.path}>
        {item.icon && <Iconify icon={item.icon} />}
        {item.title}
      </a>
      {item.children && (
        <div>
          {item.children.map((child) => (
            <a key={child.title} href={child.path}>
              {child.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Option 2: Client-Side Integration

### Step 1: Create Custom Hook

**File:** `src/hooks/use-menu.js`

```javascript
'use client';

import useSWR from 'swr';
import { getPublicMenu } from 'src/lib/supabase-client';

export function useMenu(location = 'header') {
  const { data, error, isLoading } = useSWR(`menu-${location}`, () => getPublicMenu(location), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // Cache for 1 minute
  });

  return {
    menu: data,
    isLoading,
    isError: error,
  };
}
```

### Step 2: Use in Component

**File:** `src/layouts/main/header.jsx`

```javascript
'use client';

import { useMenu } from 'src/hooks/use-menu';
import { Iconify } from 'src/components/iconify';

export function Header() {
  const { menu, isLoading } = useMenu('header');

  if (isLoading) return <HeaderSkeleton />;
  if (!menu) return <HeaderFallback />;

  return (
    <header>
      <nav>
        {menu.items.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>
    </header>
  );
}

function NavItem({ item }) {
  return (
    <div>
      <a href={item.url} target={item.target}>
        {item.icon && <Iconify icon={item.icon} />}
        {item.title}
      </a>
      {item.children?.length > 0 && (
        <div>
          {item.children.map((child) => (
            <NavItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function HeaderSkeleton() {
  return <div>Loading menu...</div>;
}

function HeaderFallback() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/post">Blog</a>
      <a href="/tentang-saya">Tentang Saya</a>
    </nav>
  );
}
```

---

## 🎨 Option 3: Hybrid Integration

### Step 1: Static Fallback

**File:** `src/layouts/nav-config-main-fallback.jsx`

```javascript
// Static fallback menu (used if database fails)
export const fallbackNavData = [
  { title: 'Home', path: '/' },
  { title: 'Blog', path: '/post' },
  { title: 'E-Book', path: '/ebook' },
  { title: 'Tentang Saya', path: '/tentang-saya' },
];
```

### Step 2: Hybrid Component

**File:** `src/layouts/main/header.jsx`

```javascript
'use client';

import { useEffect, useState } from 'react';
import { getPublicMenu } from 'src/lib/supabase-client';
import { fallbackNavData } from '../nav-config-main-fallback';

export function Header() {
  const [navData, setNavData] = useState(fallbackNavData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      try {
        const menu = await getPublicMenu('header');
        if (menu && menu.items) {
          setNavData(transformMenuItems(menu.items));
        }
      } catch (error) {
        console.error('Failed to load menu, using fallback:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadMenu();
  }, []);

  return (
    <header>
      <nav>
        {navData.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </nav>
    </header>
  );
}

function transformMenuItems(items) {
  return items.map((item) => ({
    title: item.title,
    path: item.url,
    icon: item.icon,
    children: item.children?.map((child) => ({
      title: child.title,
      path: child.url,
    })),
  }));
}
```

---

## 🎯 Complete Example: Replace nav-config-main.jsx

### Before (Static)

**File:** `src/layouts/nav-config-main.jsx`

```javascript
export const navData = [
  { title: 'Home', path: '/' },
  { title: 'Blog', path: '/post' },
  { title: 'E-Book', path: '/ebook' },
  { title: 'Tentang Saya', path: '/tentang-saya' },
];
```

### After (Dynamic)

**File:** `src/layouts/nav-config-main.jsx`

```javascript
'use server';

import { getPublicMenu } from 'src/lib/supabase-client';
import { Iconify } from 'src/components/iconify';

/**
 * Get dynamic navigation data from database
 */
export async function getNavData() {
  try {
    const menu = await getPublicMenu('header');

    if (!menu || !menu.items) {
      return getFallbackNavData();
    }

    return menu.items.map((item) => ({
      title: item.title,
      path: item.url,
      icon: item.icon ? <Iconify width={22} icon={item.icon} /> : null,
      children:
        item.children?.length > 0
          ? [
              {
                subheader: item.title,
                items: item.children.map((child) => ({
                  title: child.title,
                  path: child.url,
                })),
              },
            ]
          : undefined,
    }));
  } catch (error) {
    console.error('Error loading menu:', error);
    return getFallbackNavData();
  }
}

/**
 * Fallback navigation (if database fails)
 */
function getFallbackNavData() {
  return [
    {
      title: 'Home',
      path: '/',
      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
    },
    {
      title: 'Blog',
      path: '/post',
      icon: <Iconify width={22} icon="solar:document-text-bold-duotone" />,
    },
    {
      title: 'E-Book',
      path: '/ebook',
      icon: <Iconify width={22} icon="solar:book-bold-duotone" />,
    },
    {
      title: 'Tentang Saya',
      path: '/tentang-saya',
      icon: <Iconify width={22} icon="solar:user-bold-duotone" />,
    },
  ];
}
```

### Update Layout to Use Dynamic Nav

**File:** `src/layouts/main/layout.jsx`

```javascript
import { getNavData } from '../nav-config-main';
import { Header } from './header';

export async function MainLayout({ children }) {
  const navData = await getNavData();

  return (
    <>
      <Header navData={navData} />
      <main>{children}</main>
    </>
  );
}
```

---

## 🎨 Advanced: Mega Menu with Categories

### Example: Blog with Categories Dropdown

```javascript
'use client';

import { useState } from 'react';
import { Iconify } from 'src/components/iconify';

export function MegaMenu({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <a href={item.url}>
        {item.icon && <Iconify icon={item.icon} />}
        {item.title}
        {item.children?.length > 0 && <Iconify icon="eva:arrow-down-fill" />}
      </a>

      {open && item.children?.length > 0 && (
        <div className="mega-menu">
          <div className="grid grid-cols-3 gap-4">
            {item.children.map((child) => (
              <div key={child.id}>
                <a href={child.url}>
                  {child.icon && <Iconify icon={child.icon} />}
                  <div>
                    <h4>{child.title}</h4>
                    {child.description && <p>{child.description}</p>}
                  </div>
                </a>
                {child.children?.length > 0 && (
                  <ul>
                    {child.children.map((grandchild) => (
                      <li key={grandchild.id}>
                        <a href={grandchild.url}>{grandchild.title}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Cache Strategy

### Option 1: SWR with Revalidation

```javascript
import useSWR from 'swr';

export function useMenu(location) {
  return useSWR(`menu-${location}`, () => getPublicMenu(location), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
    refreshInterval: 600000, // 10 minutes
  });
}
```

### Option 2: React Query

```javascript
import { useQuery } from '@tanstack/react-query';

export function useMenu(location) {
  return useQuery({
    queryKey: ['menu', location],
    queryFn: () => getPublicMenu(location),
    staleTime: 300000, // 5 minutes
    cacheTime: 600000, // 10 minutes
  });
}
```

### Option 3: Next.js Cache

```javascript
import { cache } from 'react';

export const getMenuData = cache(async (location) => {
  const menu = await getPublicMenu(location);
  return menu;
});
```

---

## 🎯 Footer Menu Integration

### Example: Dynamic Footer

**File:** `src/layouts/main/footer.jsx`

```javascript
'use client';

import { useMenu } from 'src/hooks/use-menu';

export function Footer() {
  const { menu } = useMenu('footer');

  if (!menu || !menu.items.length) return null;

  return (
    <footer>
      <div className="footer-menu">
        {menu.items.map((item) => (
          <div key={item.id}>
            <h4>{item.title}</h4>
            {item.children?.length > 0 && (
              <ul>
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a href={child.url} target={child.target}>
                      {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
```

---

## 🎨 Sidebar Menu Integration

### Example: Dynamic Sidebar

**File:** `src/layouts/dashboard/nav-vertical.jsx`

```javascript
'use client';

import { useMenu } from 'src/hooks/use-menu';

export function NavVertical() {
  const { menu } = useMenu('sidebar');

  if (!menu) return <NavVerticalFallback />;

  return (
    <nav>
      {menu.items.map((item) => (
        <NavItem key={item.id} item={item} />
      ))}
    </nav>
  );
}
```

---

## 📊 Performance Optimization

### 1. Preload Menu Data

```javascript
// In layout or page
export async function generateMetadata() {
  // Preload menu data
  await getPublicMenu('header');

  return {
    title: 'My Site',
  };
}
```

### 2. Static Generation

```javascript
// Generate static menu at build time
export async function generateStaticParams() {
  const menu = await getPublicMenu('header');
  return { menu };
}
```

### 3. Edge Caching

```javascript
// Use edge runtime for faster response
export const runtime = 'edge';

export async function GET() {
  const menu = await getPublicMenu('header');
  return Response.json(menu);
}
```

---

## 🐛 Error Handling

### Graceful Fallback

```javascript
export function Header() {
  const { menu, isError } = useMenu('header');

  if (isError) {
    console.error('Menu failed to load, using fallback');
    return <HeaderFallback />;
  }

  return <HeaderDynamic menu={menu} />;
}
```

### Retry Logic

```javascript
export function useMenu(location) {
  return useSWR(`menu-${location}`, () => getPublicMenu(location), {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });
}
```

---

## ✅ Integration Checklist

- [ ] Choose integration option (SSR/Client/Hybrid)
- [ ] Create server action or custom hook
- [ ] Update layout components
- [ ] Add fallback menu
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test with different menu structures
- [ ] Optimize caching strategy
- [ ] Test performance
- [ ] Deploy and monitor

---

## 🎉 Summary

**3 Integration Options:**

1. ✅ Server-Side (Best for SEO)
2. ✅ Client-Side (Best for dynamic updates)
3. ✅ Hybrid (Best for reliability)

**Key Features:**

- Dynamic menu from database
- Nested structure support
- Fallback for reliability
- Cache optimization
- Error handling

**Next Steps:**

1. Choose your integration option
2. Implement in your layout
3. Test thoroughly
4. Deploy!

---

**Version:** 4.0.0
**Last Updated:** 2025-12-07
