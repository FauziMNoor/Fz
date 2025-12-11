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
  lock: icon('ic-lock'),
  portfolio: icon('ic-folder'), // Using folder icon for portfolio
  menu: icon('ic-folder'), // Using folder icon for menu
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
          { title: 'Categories', path: paths.dashboard.post.categories },
        ],
      },
      {
        title: 'Comments',
        path: paths.dashboard.comments,
        icon: icon('ic-chat'),
        info: <Label color="warning">Moderate</Label>,
        caption: 'Moderate post comments',
      },
      {
        title: 'Portfolio',
        path: paths.dashboard.portfolio.root,
        icon: ICONS.portfolio,
        info: <Label color="info">New</Label>,
        children: [
          { title: 'All Portfolio', path: paths.dashboard.portfolio.root },
          { title: 'Create New', path: paths.dashboard.portfolio.new },
        ],
      },
      {
        title: 'E-Books',
        path: paths.dashboard.ebook.root,
        icon: icon('ic-blog'),
        info: <Label color="success">New</Label>,
        children: [
          { title: 'All E-Books', path: paths.dashboard.ebook.root },
          { title: 'Create New', path: paths.dashboard.ebook.new },
          { title: 'Categories', path: paths.dashboard.ebook.categories },
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
   * Site Settings
   */
  {
    subheader: 'Settings',
    items: [
      {
        title: 'Menu Builder',
        path: paths.dashboard.menu.root,
        icon: ICONS.menu,
        info: <Label color="warning">New</Label>,
        caption: 'Manage navigation menus',
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
        icon: ICONS.lock,
        caption: 'Password & preferences',
      },
    ],
  },
];
