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
import { Message as MessageType, User } from '@/types';

interface BlogChatProps {
  blogId: string;
  currentUser: User;
  collaborators: User[];
}

// Mock messages data
const mockMessages: MessageType[] = [
  {
    id: '1',
    senderId: '2',
    content:
      "Hey team, I've just added a new section to the blog post. Can you please review it?",
    timestamp: new Date('2023-06-15T10:30:00'),
    status: 'read',
    type: 'text',
  },
  {
    id: '2',
    senderId: '1',
    content: "Sure, I'll take a look right away!",
    timestamp: new Date('2023-06-15T10:32:00'),
    status: 'read',
    type: 'text',
  },
  {
    id: '3',
    senderId: '3',
    content:
      "I've noticed a few typos in the introduction. I'll fix them and push the changes.",
    timestamp: new Date('2023-06-15T10:35:00'),
    status: 'read',
    type: 'text',
  },
  {
    id: '4',
    senderId: '4',
    content: "Great work everyone! I think we're almost ready to publish.",
    timestamp: new Date('2023-06-15T10:40:00'),
    status: 'read',
    type: 'text',
  },
  {
    id: '5',
    senderId: '1',
    content:
      "Agreed! Let's do a final review tomorrow morning and then we can schedule it for publication.",
    timestamp: new Date('2023-06-15T10:42:00'),
    status: 'delivered',
    type: 'text',
  },
];

export function BlogChat({
  blogId,
  currentUser,
  collaborators,
}: BlogChatProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>(mockMessages);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load messages from local storage or API
    const savedMessages = localStorage.getItem(`blog-${blogId}-messages`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [blogId]);

  useEffect(() => {
    // Save messages to local storage
    localStorage.setItem(`blog-${blogId}-messages`, JSON.stringify(messages));
  }, [blogId, messages]);

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

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: MessageType = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        content: message.trim(),
        timestamp: new Date(),
        status: 'sent',
        type: 'text',
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate message status updates
      setTimeout(() => updateMessageStatus(newMessage.id, 'delivered'), 1000);
      setTimeout(() => updateMessageStatus(newMessage.id, 'read'), 3000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newMessage: MessageType = {
          id: Date.now().toString(),
          senderId: currentUser.id,
          content: file.name,
          timestamp: new Date(),
          status: 'sent',
          type: 'file',
          fileUrl: content,
          fileName: file.name,
        };
        setMessages([...messages, newMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMessageStatus = (
    messageId: string,
    status: 'sent' | 'delivered' | 'read'
  ) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };

  return (
    <TooltipProvider>
      <div className='fixed bottom-0 right-0 mx-4 z-50 max-w-96 bg-white dark:bg-gray-900 rounded-t-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out'>
        <div className='flex items-center justify-between sm:w-96 py-2 px-3 bg-primary text-primary-foreground'>
          <div className='flex items-center space-x-2'>
            <h3 className='font-semibold'>Blog Collaboration Chat</h3>
            <div className='flex -space-x-2'>
              {collaborators.map((user) => (
                <Tooltip key={user.id}>
                  <TooltipTrigger>
                    <Avatar className='h-6 w-6 border-2 border-primary'>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className='text-gray-800 dark:text-gray-300'>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent className='border'>{user.name}</TooltipContent>
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
                    key={msg.id}
                    message={msg}
                    currentUser={currentUser}
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
    </TooltipProvider>
  );
}
