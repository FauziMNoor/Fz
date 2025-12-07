import { getNavData } from 'src/layouts/nav-config-main';
import { MainLayout } from 'src/layouts/main';

// ----------------------------------------------------------------------

export default async function HomeLayout({ children }) {
  // Fetch dynamic navigation from database
  const navData = await getNavData();

  return (
    <MainLayout
      slotProps={{
        nav: {
          data: navData,
        },
      }}
    >
      {children}
    </MainLayout>
  );
}
