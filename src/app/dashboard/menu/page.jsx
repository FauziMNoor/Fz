import { CONFIG } from 'src/global-config';

import { MenuListView } from 'src/sections/menu/view/menu-list-view-wrapper';

// ----------------------------------------------------------------------

export const metadata = { title: `Menu Management - ${CONFIG.appName}` };

export default function MenuPage() {
  return <MenuListView />;
}
