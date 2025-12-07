import { CONFIG } from 'src/global-config';

import { EbookCreateView } from 'src/sections/ebook/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create E-Book - ${CONFIG.appName}` };

export default function NewEbookPage() {
  return <EbookCreateView />;
}
