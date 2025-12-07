import { CONFIG } from 'src/global-config';

import { EbookListView } from 'src/sections/ebook/ebook-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `E-Book - ${CONFIG.appName}` };

export default function EbookPage() {
  return <EbookListView />;
}
