'use client';

//import { toast } from '@/hooks/use-toast';
import invalidate from '@/lib/actions/invalidate';
import { SocketEvents } from '@/lib/socketEvents';
import socket from '@/socket';
import { useEffect } from 'react';

const SocketListener = () => {
  useEffect(() => {
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

    socket.on(SocketEvents.NOTIFICATION_SENT, (data) => {
      console.log('Notification received', data);
      //toast({ title: 'Notification received' });
      invalidate('/', 'layout');
      invalidate('/notifications', 'page');
    });
  }, []);
  return null;
};

export default SocketListener;
