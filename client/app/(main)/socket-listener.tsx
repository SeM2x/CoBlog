'use client';

import { toast } from '@/hooks/use-toast';
import invalidate from '@/lib/actions/invalidate';
import { SocketEvents } from '@/lib/socketEvents';
import { useUserStore } from '@/lib/store';
import socket from '@/socket';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SocketListener = () => {
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

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

    socket.on(SocketEvents.BLOG_PUBLISHED, (data) => {
      if (
        pathname.includes('/edit-blog') &&
        params.id === data.blogId &&
        data.users.map((user: { id: string }) => user.id).includes(user.id)
      ) {
        toast({ title: 'Blog was published!' });
        router.push(`/blogs/${data.blogId}`);
      }
    });

    return () => {
      socket.off(SocketEvents.CONNECT);
      socket.off(SocketEvents.MESSAGE_SENT);
      socket.off(SocketEvents.INVITE_ACCEPTED);
      socket.off(SocketEvents.NOTIFICATION_SENT);
      socket.off(SocketEvents.BLOG_PUBLISHED);
    };
  }, [user, params, pathname, router]);
  return null;
};

export default SocketListener;
