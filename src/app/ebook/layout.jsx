import { MainLayout } from 'src/layouts/main';
import { getNavData } from 'src/layouts/nav-config-main';

// ----------------------------------------------------------------------

export default async function Layout({ children }) {
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
