import { getNotifications } from '@/lib/actions/notifications';
import React, { Suspense } from 'react';
import Notifications from './notifications';

const NotificationsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationGetter />
    </Suspense>
  );
};

export default NotificationsPage;

const NotificationGetter = async () => {
  const notifications = await getNotifications();
  return <Notifications notifications={notifications || []} />;
};
