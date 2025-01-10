import { Notification } from '@/types';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  AlertCircle,
  Users,
  Bell,
  UserRoundX,
  UserRoundCheck,
  Trash,
  LoaderCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  deleteNotification,
  markNotificationRead,
} from '@/lib/actions/notifications';
import { Button } from '@/components/ui/button';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';

const NotificationCard = ({
  notification,
  setSelectedInvitation,
}: {
  notification: Notification;
  setSelectedInvitation: (notification: Notification) => void;
}) => {
  const router = useRouter();

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.type === 'invite') {
      if (notification.status === 'accepted') {
        router.push(`/edit-blog/${notification.blogId?.id}`);
      } else setSelectedInvitation(notification);
    }
    if (notification.type === 'invite-response') {
      if (notification.message.includes('accept')) {
        router.push(`/edit-blog/${notification.blogId}`);
      }
    }
    if (!notification.read) markNotificationRead(notification._id);
  };

  const { execute, isPending } = useAction(deleteNotification);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    execute(notification._id);
  };

  return (
    <Card
      key={notification._id}
      className={`relative group ${
        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      } cursor-pointer transition-all shadow-none`}
      onClick={() => handleNotificationClick(notification)}
    >
      <CardContent className='p-4'>
        <div className='flex items-start'>
          <Avatar className='h-10 w-10 mr-4 flex-shrink-0'>
            <AvatarImage
              src={notification.author?.profileUrl}
              alt={notification.author?.username}
            />
            <AvatarFallback>
              <Bell className='h-5 w-5' />
            </AvatarFallback>
          </Avatar>
          <div className='flex-grow min-w-0'>
            <p className='text-sm'>
              <span className='font-semibold'>
                {notification.message.split(' ')[0]}
              </span>{' '}
              {notification.message.split(' ').slice(1).join(' ')}
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              {formatNotificationTime(new Date(notification.createdAt))}
            </p>
          </div>
          <div className='ml-4 flex-shrink-0'>
            {getNotificationIcon(notification.type, notification.message)}
          </div>
        </div>
        {notification.type === 'invite' && (
          <div className='mt-4 flex justify-end space-x-2'>
            <Badge variant='secondary'>
              {notification.status === 'pending'
                ? 'Collaboration Invite'
                : notification.status}
            </Badge>
          </div>
        )}
      </CardContent>
      <Button
        onClick={handleDelete}
        className='absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100'
        size='icon'
        variant='ghost'
      >
        {isPending ? (
          <LoaderCircle className='animate-spin' />
        ) : (
          <Trash className='text-red-500' />
        )}
      </Button>
    </Card>
  );
};

export default NotificationCard;

const getNotificationIcon = (type: string, message: string) => {
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
      return <Users className='h-4 w-4' />;
    case 'invite-response':
      return message.includes('reject') ? (
        <UserRoundX className='h-4 w-4' />
      ) : (
        <UserRoundCheck className='h-4 w-4' />
      );
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
