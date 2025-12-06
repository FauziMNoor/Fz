import { CONFIG } from 'src/global-config';

import { PortfolioCreateView } from 'src/sections/portfolio/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create Portfolio | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PortfolioCreateView />;
}
