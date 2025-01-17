'use client';

import { toast } from '@/hooks/use-toast';
import invalidate from '@/lib/actions/invalidate';
import { SocketEvents } from '@/lib/socketEvents';
import { useUserStore } from '@/lib/store';
import socket from '@/socket';
import { useEffect } from 'react';

const SocketListener = () => {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    socket.on(SocketEvents.CONNECT, () => {
      console.log('Socket connected');
    });

    socket.on(SocketEvents.MESSAGE_SENT, (blogId) => {
      console.log('Message sent', blogId);
      invalidate(`/edit-blog/${blogId}`, 'page');
    });

    socket.on(SocketEvents.INVITE_ACCEPTED, (blogId) => {
      console.log('Invite accepted', blogId);
      invalidate(`/edit-blog/${blogId}`, 'page');
    });

    socket.on(
      SocketEvents.NOTIFICATION_SENT,
      (data: { users: { id: string }[]; message: string }) => {
        console.log('Notification received', data);

        if (data.users?.map((user) => user.id).includes(user.id)) {
          toast({ title: data.message });
          invalidate('/', 'layout');
          invalidate('/notifications', 'page');
        }
      }
    );
  }, [user]);
  return null;
};

export default SocketListener;
