'use client';

import { m } from 'framer-motion';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { getUserNotifications, markAllNotificationsAsRead } from 'src/lib/supabase-client';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';
import { varTap, varHover, transitionTap } from 'src/components/animate';

import { useAuthContext } from 'src/auth/hooks';

import { NotificationItem } from './notification-item';

// ----------------------------------------------------------------------

// TABS will be calculated dynamically based on notifications

// ----------------------------------------------------------------------

export function NotificationsDrawer({ data = [], sx, ...other }) {
  const { user } = useAuthContext();
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const [currentTab, setCurrentTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    console.log('[NotificationsDrawer] fetchNotifications called');
    console.log('[NotificationsDrawer] user?.id:', user?.id);

    if (!user?.id) {
      console.warn('[NotificationsDrawer] No user ID, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      console.log('[NotificationsDrawer] Fetching notifications for user:', user.id);

      const notifData = await getUserNotifications(user.id);
      console.log('[NotificationsDrawer] Raw data from database:', notifData);

      // Transform data to match expected format
      const transformedData = notifData.map((notif) => ({
        id: notif.id,
        title: notif.title,
        description: notif.message,
        type: notif.type,
        createdAt: notif.created_at,
        isUnRead: !notif.is_read,
        link: notif.link,
      }));

      console.log('[NotificationsDrawer] Transformed data:', transformedData);
      console.log('[NotificationsDrawer] Total notifications:', transformedData.length);
      console.log(
        '[NotificationsDrawer] Unread count:',
        transformedData.filter((n) => n.isUnRead).length
      );

      setNotifications(transformedData);
    } catch (error) {
      console.error('[NotificationsDrawer] Error fetching notifications:', error);
      console.error('[NotificationsDrawer] Error details:', error.message);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch notifications when drawer opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  // Auto-fetch notifications on mount and periodically
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();

      // Refresh every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [user?.id, fetchNotifications]);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return undefined;

    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(notifications.map((notification) => ({ ...notification, isUnRead: false })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
    return undefined;
  };

  const renderHead = () => (
    <Box
      sx={{
        py: 2,
        pr: 1,
        pl: 2.5,
        minHeight: 68,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={onClose} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>

      <IconButton>
        <Iconify icon="solar:settings-bold-duotone" />
      </IconButton>
    </Box>
  );

  const renderTabs = () => {
    const allCount = notifications.length;
    const unreadCount = notifications.filter((n) => n.isUnRead).length;
    const readCount = notifications.filter((n) => !n.isUnRead).length;

    const TABS = [
      { value: 'all', label: 'All', count: allCount },
      { value: 'unread', label: 'Unread', count: unreadCount },
      { value: 'read', label: 'Read', count: readCount },
    ];

    return (
      <CustomTabs variant="fullWidth" value={currentTab} onChange={handleChangeTab}>
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={tab.label}
            icon={
              <Label
                variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
                color={
                  (tab.value === 'unread' && 'info') ||
                  (tab.value === 'read' && 'success') ||
                  'default'
                }
              >
                {tab.count}
              </Label>
            }
          />
        ))}
      </CustomTabs>
    );
  };

  const renderList = () => {
    const filteredNotifications = notifications.filter((notif) => {
      if (currentTab === 'unread') return notif.isUnRead;
      if (currentTab === 'read') return !notif.isUnRead;
      return true; // 'all'
    });

    if (loading) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading notifications...
          </Typography>
        </Box>
      );
    }

    if (filteredNotifications.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        </Box>
      );
    }

    return (
      <Scrollbar>
        <Box component="ul">
          {filteredNotifications.map((notification) => (
            <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
              <NotificationItem notification={notification} onRefresh={fetchNotifications} />
            </Box>
          ))}
        </Box>
      </Scrollbar>
    );
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Notifications button"
        onClick={onOpen}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 1, maxWidth: 420 } },
        }}
      >
        {renderHead()}
        {renderTabs()}
        {renderList()}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large">
            View all
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
