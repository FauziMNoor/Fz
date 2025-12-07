import { CONFIG } from 'src/global-config';

import { PostCategoryListView } from 'src/sections/blog/category/post-category-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Post Categories - ${CONFIG.appName}` };

export default function PostCategoriesPage() {
  return <PostCategoryListView />;
}
