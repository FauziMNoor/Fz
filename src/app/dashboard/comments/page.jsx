import { CONFIG } from 'src/global-config';

import { CommentModerationView } from 'src/sections/comment/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Moderasi Komentar - ${CONFIG.appName}` };

export default function Page() {
  return <CommentModerationView />;
}
