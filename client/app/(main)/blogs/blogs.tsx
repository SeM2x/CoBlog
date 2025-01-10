'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Share2, Bookmark, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Blog, Comment } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useAction } from 'next-safe-action/hooks';
import { createComment } from '@/lib/actions/blogs';
import LikeButton from '@/components/blogs/LikeButton';

const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment is too long (max 500 characters)'),
});

export default function BlogDetailsPage({
  blog,
  error,
  comments,
}: {
  blog?: Blog;
  error?: string;
  comments: Comment[];
}) {
  const router = useRouter();

  console.log(blog);

  useEffect(() => {
    if (error) {
      toast({ title: error, variant: 'destructive' });
      router.back();
    }
  }, [router, error]);

  const [isBookmarked, setIsBookmarked] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  const { execute: comment, isPending: commentLoading } = useAction(
    createComment,
    {
      onSuccess: () => {
        toast({ title: 'Comment posted successfully' });
      },
      onError: (error) => {
        toast({ title: error.error.serverError, variant: 'destructive' });
      },
    }
  );

  const onSubmit = (values: z.infer<typeof commentSchema>) => {
    if (blog?._id) comment({ blogId: blog?._id, content: values.content });
    form.reset();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (!blog) return;
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <Card className='mb-8'>
        <CardHeader>
          <div className='flex flex-col space-y-4'>
            <h1 className='text-4xl font-bold'>{blog.title}</h1>
            <div className='flex items-center space-x-4'>
              <Avatar>
                <AvatarImage
                  src={blog.authorProfileUrl}
                  alt={blog.authorUsername}
                />
                <AvatarFallback>
                  {blog.authorUsername[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className='text-lg'>{blog.authorUsername}</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Published on{' '}
                  {format(
                    new Date(blog.publishedAt || blog.createdAt),
                    'MMMM d, yyyy'
                  )}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Badge variant='secondary'>
                <Clock className='w-4 h-4 mr-1' />
                {blog.minutesRead} min read
              </Badge>
              <Badge variant='secondary'>
                <Users className='w-4 h-4 mr-1' />
                {blog.CoAuthors?.length || 0 + 1} contributor{' '}
                {blog.CoAuthors?.length ? 's' : ''}
              </Badge>
            </div>
            <div className='flex flex-wrap gap-2'>
              {blog.Topics?.map((topic, index) => (
                <Badge key={index} variant='outline'>
                  {topic}
                </Badge>
              ))}
              {blog.subTopics?.map((subTopic, index) => (
                <Badge key={index} variant='secondary'>
                  {subTopic}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <article className='prose dark:prose-invert lg:prose-xl max-w-none'>
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </article>
        </CardContent>
        <CardFooter className='flex justify-between items-center'>
          <div className='flex space-x-4'>
            <LikeButton
              blogId={blog._id}
              nReactions={blog.nReactions}
              variant='text'
            />
            <Button variant='ghost' size='sm'>
              <MessageCircle className='w-4 h-4 mr-2' />
              {comments.length} Comments
            </Button>
          </div>
          <div className='flex space-x-4'>
            <Button variant='ghost' size='sm' onClick={handleBookmark}>
              <Bookmark
                className={`w-4 h-4 mr-2 ${
                  isBookmarked ? 'fill-current text-primary' : ''
                }`}
              />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button variant='ghost' size='sm'>
              <Share2 className='w-4 h-4 mr-2' />
              {blog.nShares} Shares
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Contributors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-4'>
            {[
              {
                id: blog.authorId,
                username: blog.authorUsername,
                profileUrl: blog.authorProfileUrl,
              },
              ...(blog.CoAuthors || []),
            ].map((author) => (
              <div key={author.id} className='flex flex-col items-center'>
                <Avatar>
                  <AvatarImage src={author.profileUrl} alt={author.username} />
                  <AvatarFallback>
                    {author.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm mt-1'>{author.username}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='Write your comment here...'
                        className='min-h-[100px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button loading={commentLoading} type='submit'>
                Post Comment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {comments.map((comment) => (
              <div key={comment._id} className='flex space-x-4'>
                <Avatar>
                  <AvatarImage src={comment.username} alt={comment.username} />
                  <AvatarFallback>{comment.username[0]}</AvatarFallback>
                </Avatar>
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-semibold'>{comment.username}</h4>
                    <p className='text-sm text-muted-foreground'>
                      {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  <p className='text-sm'>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
