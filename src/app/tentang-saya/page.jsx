import { CONFIG } from 'src/global-config';

import { PublicProfileView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `About Me - ${CONFIG.appName}` };

export default function Page() {
  return <PublicProfileView />;
}
