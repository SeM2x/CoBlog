import LikeButton from '@/components/blogs/LikeButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FeedPost } from '@/types';
import {
  Bookmark,
  Image as ImageIcon,
  MessageCircle,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const BlogCard = ({ post }: { post: FeedPost }) => {
  return (
    <Card key={post.id} className='overflow-hidden'>
      <div className='flex flex-col md:flex-row'>
        <div className='md:w-1/3 bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
          <ImageIcon />
        </div>
        <div className='flex-1 p-6'>
          <CardHeader className='p-0 mb-4'>
            <div className='flex items-center space-x-4 mb-2'>
              <Avatar>
                <AvatarImage
                  src={post.author.profileUrl}
                  alt={post.author.username}
                />
                <AvatarFallback>
                  {post.author.username
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className='text-lg'>
                  <Link href={`/blogs/${post.id}`} className='hover:underline'>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {post.author.username} ·
                  {/* {post.createdAt} · {post.readTime} */}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            <p
              dangerouslySetInnerHTML={{ __html: post.content }}
              className='text-sm text-muted-foreground line-clamp-6'
            />
          </CardContent>
          <CardFooter className='p-0 mt-4 flex justify-between items-center'>
            <div className='flex space-x-4'>
              <LikeButton
                className='text-muted-foreground hover:text-primary'
                initialReactions={{ like: 10, clap: 2 }}
                blogId={post.id}
                userReaction={post.isLike ? 'like' : null}
              />

              <Button
                variant='ghost'
                size='sm'
                className='text-muted-foreground hover:text-primary'
              >
                <MessageCircle className='w-4 h-4 mr-2' />
                {post.nComments}
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
  );
};

export default BlogCard;
