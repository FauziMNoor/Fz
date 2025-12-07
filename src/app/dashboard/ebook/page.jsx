import { CONFIG } from 'src/global-config';

import { EbookListDashboardView } from 'src/sections/ebook/view';

// ----------------------------------------------------------------------

export const metadata = { title: `E-Books - ${CONFIG.appName}` };

export default function EbookDashboardPage() {
  return <EbookListDashboardView />;
}
