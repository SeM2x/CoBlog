'use client';

import React, { useEffect, useState } from 'react';

import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Bell, Mail } from 'lucide-react';
import Link from 'next/link';
import { Notification } from '@/types';

const NotificationsMenu = ({
  notifications,
}: {
  notifications?: Notification[];
}) => {
  const [notificationCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const unread = notifications?.filter((notification) => !notification.read);
    setNotificationsCount(unread?.length || 0);
  }, [notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {notificationCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5'
            >
              {notificationCount}
            </Badge>
          )}
          <span className='sr-only'>Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1 py-1'>
            <p className='text-sm font-medium leading-none'>Notifications</p>
            {!!notificationCount && (
              <p className='text-xs leading-none text-muted-foreground'>
                You have {notificationCount} unread messages
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!notifications || notifications.length === 0 ? (
          <div className='flex items-center justify-center p-4'>
            <p className='text-sm text-muted-foreground'>
              You&apos;re all caught up
            </p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <Link key={index} href={'/notifications'} passHref>
              <DropdownMenuItem
                className={`flex items-center gap-4 p-4 ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <Mail className='h-9 w-9' />
                <div className='flex-1 space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {notification.message.split(' ')[0]}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {notification.message.split(' ').slice(1).join(' ')}
                  </p>
                </div>
              </DropdownMenuItem>
            </Link>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href='/notifications'
            className='w-full text-center font-medium'
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
