import { CONFIG } from 'src/global-config';

import { EbookCategoryListView } from 'src/sections/ebook/category/ebook-category-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `E-Book Categories - ${CONFIG.appName}` };

export default function EbookCategoriesPage() {
  return <EbookCategoryListView />;
}
