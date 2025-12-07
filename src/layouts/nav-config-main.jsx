import { getPublicMenu } from 'src/lib/supabase-client';
import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Get dynamic navigation data from database
 * Falls back to static menu if database fails
 */
export async function getNavData() {
  try {
    const menu = await getPublicMenu('header');

    if (!menu || !menu.items || menu.items.length === 0) {
      console.warn('No menu items found, using fallback');
      return getFallbackNavData();
    }

    // Transform menu items to nav format
    return menu.items.map((item) => ({
      title: item.title,
      path: item.url,
      icon: item.icon ? <Iconify width={22} icon={item.icon} /> : null,
      children:
        item.children && item.children.length > 0
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
    console.error('Error loading menu from database:', error);
    return getFallbackNavData();
  }
}

/**
 * Fallback static navigation (used if database fails)
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
      path: paths.post.root,
      icon: <Iconify width={22} icon="solar:document-text-bold-duotone" />,
    },
    {
      title: 'E-Book',
      path: paths.ebook.root,
      icon: <Iconify width={22} icon="solar:book-bold-duotone" />,
    },
    {
      title: 'Tentang Saya',
      path: paths.about,
      icon: <Iconify width={22} icon="solar:user-bold-duotone" />,
    },
  ];
}

/**
 * Get static fallback navigation (for backward compatibility)
 * Note: This is static and won't reflect database changes
 * Use getNavData() instead for dynamic menu
 */
export async function getStaticNavData() {
  return [
    { title: 'Home', path: '/', icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" /> },
    {
      title: 'Blog',
      path: paths.post.root,
      icon: <Iconify width={22} icon="solar:document-text-bold-duotone" />,
    },
    {
      title: 'E-Book',
      path: paths.ebook.root,
      icon: <Iconify width={22} icon="solar:book-bold-duotone" />,
    },
    {
      title: 'Tentang Saya',
      path: paths.about,
      icon: <Iconify width={22} icon="solar:user-bold-duotone" />,
    },
  ];
}
