'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Check, CheckCheck, Clock, Paperclip } from 'lucide-react';
import { CoAuthor, Message as MessageType } from '@/types';
import { format } from 'date-fns';
import { useUserStore } from '@/lib/store';

const Message = ({
  message: msg,
  collaborators,
}: {
  message: MessageType;
  collaborators: CoAuthor[];
}) => {
  const currentUser = useUserStore((state) => state.user);

  if (!currentUser) return null;
  return (
    <div
      className={`mb-4 flex flex-col ${
        msg.senderId === currentUser.id ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`max-w-[70%] ${
          msg.senderId === currentUser.id
            ? 'bg-primary text-primary-foreground'
            : 'bg-gray-200 dark:bg-gray-700'
        } rounded-lg p-3 shadow`}
      >
        {msg.senderId !== currentUser.id && (
          <div className='flex items-center mb-1'>
            <Avatar className='h-5 w-5 mr-2'>
              <AvatarImage
                src={
                  collaborators.find((u) => u.id === msg.senderId)
                    ?.profileUrl || ''
                }
              />
              <AvatarFallback>
                {collaborators
                  .find((u) => u.id === msg.senderId)
                  ?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className='text-xs font-medium'>
              {collaborators.find((u) => u.id === msg.senderId)?.username}
            </span>
          </div>
        )}
        {<p className='text-sm'>{msg.message}</p>}
        {msg.type === 'file' && (
          <a
            href={msg.fileUrl}
            download={msg.fileName}
            className='flex items-center space-x-2 text-sm'
          >
            <Paperclip className='h-4 w-4' />
            <span>{msg.fileName}</span>
          </a>
        )}
      </div>
      <div className='text-xs mt-2 gap-1 flex justify-between items-center'>
        <span>{format(msg.createdAt, 'h:mm a')}</span>
        {msg.senderId === currentUser.id && (
          <span>
            {msg.status === 'sending' ? (
              <Clock className='inline h-3 w-3' />
            ) : (
              <Check className='inline h-3 w-3' />
            )}
            {msg.status === 'sent' && <Check className='inline h-3 w-3' />}
            {msg.status === 'delivered' && (
              <CheckCheck className='inline h-3 w-3' />
            )}
            {msg.status === 'read' && (
              <CheckCheck className='inline h-3 w-3 text-blue-500' />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
