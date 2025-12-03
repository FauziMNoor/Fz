import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'Home',
    href: '/',
    icon: <Iconify icon="solar:home-angle-bold-duotone" />,
  },
  {
    label: 'Profile',
    href: paths.dashboard.user.root,
    icon: <Iconify icon="custom:profile-duotone" />,
  },
  {
    label: 'Security',
    href: `${paths.dashboard.user.account}/change-password`,
    icon: <Iconify icon="solar:shield-keyhole-bold-duotone" />,
  },
  {
    label: 'Account settings',
    href: paths.dashboard.user.account,
    icon: <Iconify icon="solar:settings-bold-duotone" />,
  },
];
