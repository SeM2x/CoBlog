'use client';

import React, { useState } from 'react';

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
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';

const recentNotifications = [
  {
    user: { name: 'John Doe', avatar: '/avatars/john-doe.png' },
    content: 'liked your post',
  },
  {
    user: { name: 'Jane Smith', avatar: '/avatars/jane-smith.png' },
    content: 'commented on your blog',
  },
  {
    user: { name: 'Alice Cooper', avatar: '/avatars/alice-cooper.png' },
    content: 'started following you',
  },
];
const NotificationsMenu = () => {
  const [notificationCount] = useState(3);

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
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>Notifications</p>
            <p className='text-xs leading-none text-muted-foreground'>
              You have {notificationCount} unread messages
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.map((notification, index) => (
          <DropdownMenuItem key={index} className='flex items-center gap-4 p-4'>
            <Avatar className='h-8 w-8'>
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
            <div className='flex-1 space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {notification.user.name}
              </p>
              <p className='text-xs text-muted-foreground'>
                {notification.content}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
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
