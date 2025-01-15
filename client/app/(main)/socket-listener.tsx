'use client';

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
  }, []);
  return null;
};

export default SocketListener;
