'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  BookOpen,
  User,
  Bell,
  Bookmark,
  TrendingUp,
  Image,
} from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with Next.js 14',
    excerpt:
      'Learn how to build modern web applications with Next.js 14 and its new app directory structure.',
    author: { name: 'John Doe', avatar: '/placeholder.svg?height=32&width=32' },
    likes: 42,
    comments: 15,
    category: 'Web Development',
    readTime: '5 min read',
    publishDate: '2023-05-15',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: 2,
    title: 'Mastering TypeScript for React Development',
    excerpt:
      'Discover how TypeScript can improve your React development experience and catch errors early.',
    author: {
      name: 'Jane Smith',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    likes: 38,
    comments: 22,
    category: 'JavaScript',
    readTime: '7 min read',
    publishDate: '2023-05-12',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: 3,
    title: 'Building Responsive UIs with Tailwind CSS',
    excerpt:
      'Learn how to create beautiful and responsive user interfaces using Tailwind CSS utility classes.',
    author: {
      name: 'Bob Johnson',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    likes: 55,
    comments: 18,
    category: 'CSS',
    readTime: '6 min read',
    publishDate: '2023-05-10',
    image: '/placeholder.svg?height=400&width=600',
  },
];

const suggestedUsers = [
  {
    id: 1,
    name: 'Alice Cooper',
    avatar: '/placeholder.svg?height=40&width=40',
    bio: 'Tech enthusiast & blogger',
  },
  {
    id: 2,
    name: 'David Lee',
    avatar: '/placeholder.svg?height=40&width=40',
    bio: 'Full-stack developer',
  },
  {
    id: 3,
    name: 'Emma Watson',
    avatar: '/placeholder.svg?height=40&width=40',
    bio: 'UI/UX designer & writer',
  },
];

const trendingTopics = [
  { id: 1, name: 'React', count: 1234 },
  { id: 2, name: 'Next.js', count: 987 },
  { id: 3, name: 'TypeScript', count: 876 },
  { id: 4, name: 'TailwindCSS', count: 765 },
  { id: 5, name: 'GraphQL', count: 654 },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold'>Welcome to CoBlog</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='w-full border-b'>
              <TabsTrigger value='feed' className='flex-1'>
                Your Feed
              </TabsTrigger>
              <TabsTrigger value='discover' className='flex-1'>
                Discover
              </TabsTrigger>
            </TabsList>
            <TabsContent value='feed' className='space-y-6 pt-6'>
              {blogPosts.map((post) => (
                <Card key={post.id} className='overflow-hidden'>
                  <div className='flex flex-col md:flex-row'>
                    <div className='md:w-1/3 bg-gray-50 flex items-center justify-center'>
                      <Image />
                    </div>
                    <div className='flex-1 p-6'>
                      <CardHeader className='p-0 mb-4'>
                        <div className='flex items-center space-x-4 mb-2'>
                          <Avatar>
                            <AvatarImage
                              src={post.author.avatar}
                              alt={post.author.name}
                            />
                            <AvatarFallback>
                              {post.author.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className='text-lg'>
                              {post.title}
                            </CardTitle>
                            <CardDescription>
                              {post.author.name} · {post.publishDate} ·{' '}
                              {post.readTime}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='p-0'>
                        <p className='text-sm text-muted-foreground'>
                          {post.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter className='p-0 mt-4 flex justify-between items-center'>
                        <div className='flex space-x-4'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-muted-foreground hover:text-primary'
                          >
                            <ThumbsUp className='w-4 h-4 mr-2' />
                            {post.likes}
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-muted-foreground hover:text-primary'
                          >
                            <MessageCircle className='w-4 h-4 mr-2' />
                            {post.comments}
                          </Button>
                        </div>
                        <div className='flex space-x-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-muted-foreground hover:text-primary'
                          >
                            <Bookmark className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-muted-foreground hover:text-primary'
                          >
                            <Share2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value='discover' className='pt-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Discover New Content</CardTitle>
                  <CardDescription>
                    Find interesting articles and bloggers based on your
                    interests.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder='Search for topics, authors, or keywords'
                    className='mb-6'
                  />
                  <div className='space-y-4'>
                    <h3 className='font-semibold'>Trending Topics</h3>
                    <div className='flex flex-wrap gap-2'>
                      {trendingTopics.map((topic) => (
                        <Button key={topic.id} variant='outline' size='sm'>
                          #{topic.name}
                          <span className='ml-2 text-xs bg-muted text-muted-foreground rounded-full px-2 py-1'>
                            {topic.count}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className='border rounded-lg overflow-hidden'>
          <div className='bg-background p-6 border-b'>
            <h2 className='text-xl font-semibold mb-4'>Suggested Users</h2>
            <ScrollArea className='h-[250px] pr-4'>
              <div className='space-y-4'>
                {suggestedUsers.map((user) => (
                  <div
                    key={user.id}
                    className='flex items-center justify-between py-2'
                  >
                    <div className='flex items-center space-x-3'>
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>{user.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {user.bio}
                        </p>
                      </div>
                    </div>
                    <Button variant='outline' size='sm'>
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className='bg-background p-6 border-b'>
            <h2 className='text-xl font-semibold mb-4'>Quick Links</h2>
            <div className='space-y-2'>
              <Link href='/my-blogs'>
                <Button variant='ghost' className='w-full justify-start'>
                  <BookOpen className='mr-2 h-4 w-4' />
                  My Blogs
                </Button>
              </Link>
              <Link href='/profile'>
                <Button variant='ghost' className='w-full justify-start'>
                  <User className='mr-2 h-4 w-4' />
                  Profile
                </Button>
              </Link>
              <Link href='/notifications'>
                <Button variant='ghost' className='w-full justify-start'>
                  <Bell className='mr-2 h-4 w-4' />
                  Notifications
                </Button>
              </Link>
            </div>
          </div>

          <div className='bg-background rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4'>Trending Now</h2>
            <ScrollArea className='h-[200px]'>
              <div className='space-y-4'>
                {blogPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className='flex items-center space-x-4 py-2'
                  >
                    <div className='flex-shrink-0 text-2xl font-bold text-muted-foreground w-8 text-center'>
                      {index + 1}
                    </div>
                    <div className='flex-grow'>
                      <h4 className='font-medium line-clamp-1'>{post.title}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {post.author.name}
                      </p>
                    </div>
                    <TrendingUp className='w-4 h-4 text-primary' />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
