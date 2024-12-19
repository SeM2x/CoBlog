'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  BookOpen,
  Edit3,
  User,
  Bell,
} from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with Next.js 14',
    excerpt:
      'Learn how to build modern web applications with Next.js 14 and its new app directory structure.',
    author: { name: 'John Doe', avatar: '/avatars/john-doe.png' },
    likes: 42,
    comments: 15,
    category: 'Web Development',
    readTime: '5 min read',
    publishDate: '2023-05-15',
  },
  {
    id: 2,
    title: 'Mastering TypeScript for React Development',
    excerpt:
      'Discover how TypeScript can improve your React development experience and catch errors early.',
    author: { name: 'Jane Smith', avatar: '/avatars/jane-smith.png' },
    likes: 38,
    comments: 22,
    category: 'JavaScript',
    readTime: '7 min read',
    publishDate: '2023-05-12',
  },
  {
    id: 3,
    title: 'Building Responsive UIs with Tailwind CSS',
    excerpt:
      'Learn how to create beautiful and responsive user interfaces using Tailwind CSS utility classes.',
    author: { name: 'Bob Johnson', avatar: '/avatars/bob-johnson.png' },
    likes: 55,
    comments: 18,
    category: 'CSS',
    readTime: '6 min read',
    publishDate: '2023-05-10',
  },
];

const suggestedFollowers = [
  {
    id: 1,
    name: 'Alice Cooper',
    avatar: '/avatars/alice-cooper.png',
    bio: 'Tech enthusiast & blogger',
    followers: 1200,
  },
  {
    id: 2,
    name: 'David Lee',
    avatar: '/avatars/david-lee.png',
    bio: 'Full-stack developer',
    followers: 980,
  },
  {
    id: 3,
    name: 'Emma Watson',
    avatar: '/avatars/emma-watson.png',
    bio: 'UI/UX designer & writer',
    followers: 1500,
  },
];

const trendingTags = [
  { id: 1, name: 'NextJS', count: 1234 },
  { id: 2, name: 'React', count: 987 },
  { id: 3, name: 'TypeScript', count: 876 },
  { id: 4, name: 'TailwindCSS', count: 765 },
  { id: 5, name: 'WebDev', count: 654 },
];

const userStats = {
  posts: 15,
  followers: 230,
  following: 180,
  views: 1200,
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Welcome back, John!</CardTitle>
              <CardDescription>
                Here&apos;s what&apos;s happening in your blog world today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap justify-between items-center gap-4'>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  <div className='text-center'>
                    <p className='text-2xl font-bold'>{userStats.posts}</p>
                    <p className='text-sm text-gray-500'>Posts</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-2xl font-bold'>{userStats.followers}</p>
                    <p className='text-sm text-gray-500'>Followers</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-2xl font-bold'>{userStats.following}</p>
                    <p className='text-sm text-gray-500'>Following</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-2xl font-bold'>{userStats.views}</p>
                    <p className='text-sm text-gray-500'>Views</p>
                  </div>
                </div>
                <Link href={'/blogs/new'}>
                  <Button>
                    <Edit3 className='w-4 h-4 mr-2' />
                    New Post
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='feed'>Your Feed</TabsTrigger>
              <TabsTrigger value='trending'>Trending</TabsTrigger>
            </TabsList>
            <TabsContent value='feed' className='space-y-4'>
              {blogPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className='flex flex-col sm:flex-row justify-between items-start gap-2'>
                      <div>
                        <Link
                          href={'/blogs/123'}
                          className='hover:underline underline-offset-2'
                        >
                          <CardTitle>{post.title}</CardTitle>
                        </Link>
                        <CardDescription>{post.excerpt}</CardDescription>
                      </div>
                      <Button variant='outline' size='sm'>
                        {post.category}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center space-x-4'>
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
                        <p className='text-sm font-medium'>
                          {post.author.name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {post.publishDate} · {post.readTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-wrap justify-between gap-2'>
                    <div className='flex space-x-4'>
                      <Button variant='ghost' size='sm'>
                        <ThumbsUp className='w-4 h-4 mr-2' />
                        {post.likes}
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <MessageCircle className='w-4 h-4 mr-2' />
                        {post.comments}
                      </Button>
                    </div>
                    <Button variant='ghost' size='sm'>
                      <Share2 className='w-4 h-4 mr-2' />
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value='trending'>
              <Card>
                <CardHeader>
                  <CardTitle>Trending Posts</CardTitle>
                  <CardDescription>
                    See what&apos;s popular in the community right now.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add trending posts content here */}
                  <p>Trending posts will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Suggested Followers</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {suggestedFollowers.map((follower) => (
                <div
                  key={follower.id}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-4'>
                    <Avatar>
                      <AvatarImage src={follower.avatar} alt={follower.name} />
                      <AvatarFallback>
                        {follower.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-sm font-medium'>{follower.name}</p>
                      <p className='text-xs text-gray-500'>{follower.bio}</p>
                    </div>
                  </div>
                  <Button variant='outline' size='sm'>
                    Follow
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trending Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {trendingTags.map((tag) => (
                  <Button key={tag.id} variant='outline' size='sm'>
                    #{tag.name}
                    <span className='ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-1'>
                      {tag.count}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Button className='w-full justify-start' variant='outline'>
                <BookOpen className='w-4 h-4 mr-2' />
                My Drafts
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <User className='w-4 h-4 mr-2' />
                Edit Profile
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <Bell className='w-4 h-4 mr-2' />
                Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
