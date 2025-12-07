import { CONFIG } from 'src/global-config';
import { getEbookBySlug } from 'src/lib/supabase-client';

import { EbookDetailView } from 'src/sections/ebook/ebook-detail-view';

// ----------------------------------------------------------------------

export const metadata = { title: `E-Book Detail - ${CONFIG.appName}` };

async function getEbook(slug) {
  try {
    const ebook = await getEbookBySlug(slug);
    return ebook;
  } catch (error) {
    console.error('Error fetching e-book:', error);
    return null;
  }
}

export default async function EbookDetailPage({ params }) {
  const { slug } = await params;
  const ebook = await getEbook(slug);

  if (!ebook) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>E-Book Not Found</h1>
        <p>The e-book with slug &quot;{slug}&quot; does not exist or is not published.</p>
        <a href="/ebook">← Back to E-Books</a>
      </div>
    );
  }

  return <EbookDetailView ebook={ebook} />;
}
