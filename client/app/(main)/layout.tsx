import { Navbar } from '@/components/navbar';
import { getNotifications } from '@/lib/actions/notifications';
import React, { Suspense } from 'react';
import ValidateToken from './validate-token';

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ValidateToken />
      <Suspense fallback={null}>
        <NotificationsGetter />
      </Suspense>
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </>
  );
};

export default layout;

const NotificationsGetter = async () => {
  const notifications = await getNotifications();
  return <Navbar notifications={notifications || []} />;
};
