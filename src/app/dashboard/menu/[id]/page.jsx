import { CONFIG } from 'src/global-config';

import { MenuItemListView } from 'src/sections/menu/view/menu-item-list-view-wrapper';

// ----------------------------------------------------------------------

export const metadata = { title: `Menu Items - ${CONFIG.appName}` };

export default function MenuItemsPage() {
  return <MenuItemListView />;
}
