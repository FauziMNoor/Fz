-- Test notification manually
-- Run this in Supabase SQL Editor to create a test notification

-- Insert test notification for your user
INSERT INTO notifications (user_id, type, title, message, link, is_read)
VALUES (
  'bb2e61da-8f0c-4f12-9fef-59f82db50d69', -- Your user ID
  'comment',
  'Test Notification',
  'This is a test notification. If you see this, the notification system is working!',
  '/dashboard/user',
  false
);

-- View all your notifications
SELECT
  id,
  type,
  title,
  message,
  is_read,
  created_at
FROM notifications
WHERE user_id = 'bb2e61da-8f0c-4f12-9fef-59f82db50d69'
ORDER BY created_at DESC;
