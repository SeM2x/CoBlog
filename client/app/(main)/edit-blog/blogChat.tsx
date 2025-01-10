'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronUp, ChevronDown, Smile, Send, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Message from '@/components/blog-chat/Message';
import { Blog, CoAuthor, Message as MessageType } from '@/types';
import { sendMessage } from '@/lib/actions/messages';

interface BlogChatProps {
  blog: Blog;
  collaborators: CoAuthor[];
  messages: MessageType[];
}

export function BlogChat({ messages, blog, collaborators }: BlogChatProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Save messages to local storage
    localStorage.setItem(`blog-${blog._id}-messages`, JSON.stringify(messages));
  }, [blog._id, messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [isMinimized]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial scroll

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      console.log(blog);
      
      const res = await sendMessage({
        conversationId: blog.conversationId,
        blogId: blog._id,
        message: message.trim(),
      });

      console.log(res);

      // const newMessage: MessageType = {
      //   id: Date.now().toString(),
      //   senderId: currentUser.id,
      //   content: message.trim(),
      //   timestamp: new Date(),
      //   status: 'sent',
      //   type: 'text',
      // };
      setMessage('');

      // Simulate message status updates
      // setTimeout(() => updateMessageStatus(newMessage.id, 'delivered'), 1000);
      // setTimeout(() => updateMessageStatus(newMessage.id, 'read'), 3000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newMessage = {
          fileUrl: content,
          fileName: file.name,
        };
        console.log(newMessage);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <TooltipProvider>
      <div className='fixed bottom-0 right-0 z-50 w-full max-w-96 px-3'>
        <div className=' bg-white dark:bg-gray-900 w-full max-w-96 rounded-t-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out'>
          <div className='flex items-center justify-between w-full py-2 px-3 bg-primary text-primary-foreground'>
            <div className='flex items-center space-x-2'>
              <h3 className='font-semibold line-clamp-2'>{blog.title}</h3>
              <div className='flex -space-x-2'>
                {collaborators.map((user) => (
                  <Tooltip key={user.id}>
                    <TooltipTrigger>
                      <Avatar className='h-6 w-6 border-2 border-primary'>
                        <AvatarImage
                          src={user.profileUrl || ''}
                          alt={user.username}
                        />
                        <AvatarFallback className='text-gray-800 dark:text-gray-300'>
                          {user.username?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent className='border'>
                      {user.username}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsMinimized(!isMinimized)}
              className='text-primary-foreground hover:bg-primary-foreground/20'
            >
              {isMinimized ? (
                <ChevronUp className='h-4 w-4' />
              ) : (
                <ChevronDown className='h-4 w-4' />
              )}
            </Button>
          </div>
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ScrollArea className='h-96 px-4 pt-1' ref={scrollAreaRef}>
                  {messages.map((msg) => (
                    <Message
                      key={msg._id}
                      message={msg}
                      collaborators={collaborators}
                    />
                  ))}
                </ScrollArea>
                <div className='p-2 bg-gray-100 dark:bg-gray-800'>
                  <div className='flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-full px-4 py-1 focus-within:ring-2 focus-within:ring-primary'>
                    <Input
                      type='text'
                      placeholder='Type a message...'
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSendMessage()
                      }
                      className='shadow-none flex-grow border-none bg-transparent focus-visible:ring-0 focus:outline-none focus:ring-0'
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-full h-fit p-2 dark:hover:text-gray-200'
                        >
                          <Smile className='h-5 w-5' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Insert emoji</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full h-fit p-2'
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className='h-5 w-5' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Attach file</p>
                      </TooltipContent>
                    </Tooltip>
                    <input
                      type='file'
                      ref={fileInputRef}
                      className='hidden'
                      onChange={handleFileUpload}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className='bg-primary text-primary-foreground hover:bg-primary/90 p-2 w-10 flex items-center justify-center rounded-full h-fit'
                    >
                      <Send className='h-5 w-5' />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}
