-- Fix notification insert policy
-- The trigger needs permission to insert notifications

-- Drop and recreate the insert policy
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- Allow anyone (including triggers) to insert notifications
CREATE POLICY "Allow insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'notifications'
ORDER BY policyname;

-- Test: Try to insert via trigger by adding a comment
-- This should now work
