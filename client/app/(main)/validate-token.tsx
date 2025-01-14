'use client';

import { validateToken } from '@/lib/actions/auth';
import { SocketEvents } from '@/lib/socketEvents';
import socket from '@/socket';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

const ValidateToken = () => {
  useEffect(() => {
    const validate = async () => {
      const res = await validateToken();
      if (!res?.success && res?.status === 403) {
        signOut({ redirectTo: '/login?error=sessionExpired' });
      }
    };
    validate();
  }, []);

  useEffect(() => {
    socket.on(SocketEvents.CONNECT, () => {
      console.log('Socket connected');
    });
  }, []);
  return null;
};

export default ValidateToken;
