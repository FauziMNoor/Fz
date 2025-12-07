import { CONFIG } from 'src/global-config';

import { EbookEditView } from 'src/sections/ebook/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Edit E-Book - ${CONFIG.appName}` };

export default async function EditEbookPage({ params }) {
  const { id } = await params;

  return <EbookEditView id={id} />;
}
