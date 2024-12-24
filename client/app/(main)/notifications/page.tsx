'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: 'like',
    user: { name: 'John Doe', avatar: '/avatars/john-doe.png' },
    content: 'liked your post',
    post: 'Getting Started with Next.js 14',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 2,
    type: 'comment',
    user: { name: 'Jane Smith', avatar: '/avatars/jane-smith.png' },
    content: 'commented on your post',
    post: 'Mastering TypeScript for React Development',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 3,
    type: 'follow',
    user: { name: 'Alice Cooper', avatar: '/avatars/alice-cooper.png' },
    content: 'started following you',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 4,
    type: 'like',
    user: { name: 'Bob Johnson', avatar: '/avatars/bob-johnson.png' },
    content: 'liked your post',
    post: 'Building Responsive UIs with Tailwind CSS',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 5,
    type: 'share',
    user: { name: 'Emma Watson', avatar: '/avatars/emma-watson.png' },
    content: 'shared your post',
    post: 'Advanced React Hooks',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 6,
    type: 'mention',
    user: { name: 'David Lee', avatar: '/avatars/david-lee.png' },
    content: 'mentioned you in a comment',
    post: 'The Future of Web Development',
    time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [notificationList, setNotificationList] = useState(notifications);

  const filteredNotifications = notificationList.filter(
    (notification) =>
      activeTab === 'all' || (activeTab === 'unread' && !notification.read)
  );

  const markAllAsRead = () => {
    setNotificationList((prevList) =>
      prevList.map((notification) => ({ ...notification, read: true }))
    );
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
      default:
        return null;
    }
  };

  const formatNotificationTime = (time: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - time.getTime()) / 36e5;

    if (diffInHours < 24) {
      return format(time, 'h:mm a');
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(time, 'MMM d');
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
            key={notification.id}
            className={`flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ${
              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <Avatar className='h-10 w-10 mr-4 flex-shrink-0'>
              <AvatarImage
                src={notification.user.avatar}
                alt={notification.user.name}
              />
              <AvatarFallback>
                {notification.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className='flex-grow min-w-0'>
              <p className='text-sm'>
                <span className='font-semibold'>{notification.user.name}</span>{' '}
                {notification.content}
                {notification.post && (
                  <span className='font-medium text-gray-700 dark:text-gray-300'>
                    {' '}
                    &quot;{notification.post}&quot;
                  </span>
                )}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                {formatNotificationTime(notification.time)}
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
