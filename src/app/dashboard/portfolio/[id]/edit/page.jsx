import { CONFIG } from 'src/global-config';

import { PortfolioEditView } from 'src/sections/portfolio/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Edit Portfolio | Dashboard - ${CONFIG.appName}` };

export default function Page({ params }) {
  const { id } = params;

  return <PortfolioEditView id={id} />;
}
