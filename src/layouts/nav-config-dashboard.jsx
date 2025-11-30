import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  blog: icon('ic-blog'),
  user: icon('ic-user'),
  folder: icon('ic-folder'),
  dashboard: icon('ic-dashboard'),
  analytics: icon('ic-analytics'),
  settings: icon('ic-setting'),
};

// ----------------------------------------------------------------------

/**
 * Navigation for Single User Blog Dashboard
 * Simplified navigation for professional writer/blogger
 */
export const navData = [
  /**
   * Overview - Blog Statistics
   */
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
        caption: 'Blog statistics & overview',
      },
    ],
  },
  /**
   * Content Management - Core blogging features
   */
  {
    subheader: 'Content',
    items: [
      {
        title: 'Posts',
        path: paths.dashboard.post.root,
        icon: ICONS.blog,
        info: <Label color="success">Write</Label>,
        children: [
          { title: 'All Posts', path: paths.dashboard.post.root },
          { title: 'Create New', path: paths.dashboard.post.new },
        ],
      },
      {
        title: 'Media Library',
        path: paths.dashboard.fileManager,
        icon: ICONS.folder,
        caption: 'Manage images & files',
      },
    ],
  },
  /**
   * Author Settings
   */
  {
    subheader: 'Author',
    items: [
      {
        title: 'My Profile',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        caption: 'Public author profile',
      },
      {
        title: 'Account Settings',
        path: paths.dashboard.user.account,
        icon: ICONS.settings,
        caption: 'Password & preferences',
      },
    ],
  },
];
