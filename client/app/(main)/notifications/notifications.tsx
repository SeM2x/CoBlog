'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Notification } from '@/types';
import InvitationModal from './InvitationModal';
import { useAction } from 'next-safe-action/hooks';
import { acceptCollaboration, rejectCollaboration } from '@/lib/actions/blogs';
import { toast } from '@/hooks/use-toast';
import { markNotificationRead } from '@/lib/actions/notifications';
import { useRouter } from 'next/navigation';
import NotificationCard from './NotificationCard';

export default function NotificationsPage({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [notificationList, setNotificationList] = useState(notifications);
  const [selectedInvitation, setSelectedInvitation] =
    useState<Notification | null>(null);

  const filteredNotifications = notificationList.filter(
    (notification) =>
      activeTab === 'all' ||
      (activeTab === 'unread' && !notification.read) ||
      (activeTab === 'invites' && notification.type === 'invite')
  );

  useEffect(() => {
    setNotificationList(notifications);
  }, [notifications]);

  const markAllAsRead = async () => {
    setNotificationList((prevList) => {
      return prevList.map((notification) => ({ ...notification, read: true }));
    });
    const failedNotifications = await Promise.all(
      filteredNotifications.map((notification) =>
        markNotificationRead(notification._id)
      )
    );
    setNotificationList((prevList) => {
      return prevList.map((notification) => ({
        ...notification,
        read: failedNotifications.includes(notification._id)
          ? false
          : notification.read,
      }));
    });
    console.log(failedNotifications);

    if ([...failedNotifications].find((item) => item !== undefined)) {
      toast({
        title: 'Failed to mark some notifications as read',
        variant: 'destructive',
      });
    }
  };

  const router = useRouter();

  const onSettled = (res: boolean) => ({
    onSuccess: ({ input }: { input: { blogId: string } }) => {
      toast({
        title: res
          ? 'Collaboration request accepted'
          : 'Collaboration request rejected',
      });
      if (res) router.push(`/new-blog/${input.blogId}`);
    },
    onError: ({
      error: { serverError },
    }: {
      error: { serverError?: string };
    }) => {
      toast({
        title: res
          ? `Failed to accept collaboration request${
              serverError ? ': ' + serverError : ''
            }`
          : `Failed to reject collaboration request${
              serverError ? ': ' + serverError : ''
            }`,
        variant: 'destructive',
      });
    },
  });

  const { executeAsync: executeAccept, isPending: isAcceptPending } = useAction(
    acceptCollaboration,
    onSettled(true)
  );
  const { executeAsync: executeReject, isPending: isRejectPending } = useAction(
    rejectCollaboration,
    onSettled(false)
  );

  const handleInvitationResponse = async (
    accept: boolean,
    { notificationId, blogId }: { notificationId?: string; blogId?: string }
  ) => {
    if (!notificationId || !blogId) return;
    if (accept) await executeAccept({ notificationId, blogId });
    else await executeReject({ notificationId, blogId });
    setSelectedInvitation(null);
  };

  console.log(notifications[1]);

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Notifications</h1>
        <Button variant='ghost' onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='w-full mb-6'
      >
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='unread'>Unread</TabsTrigger>
          <TabsTrigger value='invites'>Invites</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='space-y-4'>
        {filteredNotifications.length === 0 ? (
          <div className='text-center text-gray-500 dark:text-gray-400'>
            You&apos;re all caught up!
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              setSelectedInvitation={setSelectedInvitation}
            />
          ))
        )}
      </div>
      <InvitationModal
        loading={{ accept: isAcceptPending, reject: isRejectPending }}
        selectedInvitation={selectedInvitation}
        setSelectedInvitation={setSelectedInvitation}
        handleInvitationResponse={handleInvitationResponse}
      />
    </div>
  );
}
