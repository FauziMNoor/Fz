import { CONFIG } from 'src/global-config';

import { PortfolioListView } from 'src/sections/portfolio/portfolio-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Portfolio | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PortfolioListView />;
}
