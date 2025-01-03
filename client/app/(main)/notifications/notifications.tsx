'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  AlertCircle,
  Bell,
  Mail,
} from 'lucide-react';
import { Notification } from '@/types';
import { markNotificationRead } from '@/lib/actions/notifications';
import { toast } from '@/hooks/use-toast';

export default function Notifications({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [notificationList, setNotificationList] = useState(notifications);

  const filteredNotifications = notificationList.filter(
    (notification) =>
      activeTab === 'all' || (activeTab === 'unread' && !notification.read)
  );

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className='h-4 w-4 text-red-500' />;
      case 'comment':
        return <MessageCircle className='h-4 w-4 text-blue-500' />;
      case 'follow':
        return <UserPlus className='h-4 w-4 text-green-500' />;
      case 'share':
        return <Share2 className='h-4 w-4 text-purple-500' />;
      case 'mention':
        return <AlertCircle className='h-4 w-4 text-yellow-500' />;
      case 'invite':
        return <Mail className='h-4 w-4' />;
      default:
        return null;
    }
  };

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
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='unread'>Unread</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='space-y-1'>
        {filteredNotifications.map((notification) => (
          <div
            key={notification._id}
            className={`flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ${
              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <Bell className='h-9 w-9 mr-4 flex-shrink-0' />
            <div className='flex-grow min-w-0'>
              <p className='text-sm'>
                {notification.message}
                {/* {notification.post && (
                  <span className='font-medium text-gray-700 dark:text-gray-300'>
                    {' '}
                    &quot;{notification.post}&quot;
                  </span>
                )} */}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                {notification.createdAt}
              </p>
            </div>
            <div className='ml-4 flex-shrink-0'>
              {getNotificationIcon(notification.type)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
