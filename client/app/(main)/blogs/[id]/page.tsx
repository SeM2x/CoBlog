import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

const blogPost = {
  id: 1,
  title: 'Getting Started with Next.js 14',
  content: `
    <h2>Introduction</h2>
    <p>Next.js 14 introduces several new features and improvements that make building modern web applications even easier. In this blog post, we'll explore the key highlights and how to get started with this powerful framework.</p>

    <h2>Key Features</h2>
    <ul>
      <li>Improved performance with server components</li>
      <li>Enhanced static site generation capabilities</li>
      <li>Built-in image optimization</li>
      <li>Automatic font optimization</li>
    </ul>
    
    <h2>Getting Started</h2>
    <p>To create a new Next.js 14 project, you can use the following command:</p>
    <pre><code>npx create-next-app@latest my-next-app</code></pre>
    
    <p>This will set up a new Next.js project with the latest features and best practices.</p>
    
    <h2>Conclusion</h2>
    <p>Next.js 14 brings significant improvements to the developer experience and application performance. By leveraging these new features, you can build faster, more efficient web applications with ease.</p>
  `,
  author: {
    name: 'John Doe',
    avatar: '/avatars/john-doe.png',
  },
  publishedAt: '2023-05-15T10:00:00Z',
  likes: 42,
  comments: [
    {
      id: 1,
      author: 'Alice',
      content: 'Great article! Very informative.',
      avatar: '/avatars/alice.png',
    },
    {
      id: 2,
      author: 'Bob',
      content: 'Thanks for sharing. I learned a lot.',
      avatar: '/avatars/bob.png',
    },
  ],
};

export default function BlogDetailsPage() {
  return (
    <div className='max-w-3xl mx-auto space-y-8'>
      <article className='prose dark:prose-invert lg:prose-xl'>
        <h1>{blogPost.title}</h1>
        <div className='flex items-center space-x-4 my-4'>
          <Avatar>
            <AvatarImage
              src={blogPost.author.avatar}
              alt={blogPost.author.name}
            />
            <AvatarFallback>
              {blogPost.author.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='text-sm font-medium'>{blogPost.author.name}</p>
            <p className='text-sm text-light-secondary dark:text-dark-secondary'>
              {new Date(blogPost.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
      </article>
      <div className='flex justify-between items-center'>
        <Button variant='ghost' size='sm'>
          <ThumbsUp className='w-4 h-4 mr-2' />
          {blogPost.likes} Likes
        </Button>
        <Button variant='ghost' size='sm'>
          <MessageCircle className='w-4 h-4 mr-2' />
          {blogPost.comments.length} Comments
        </Button>
        <Button variant='ghost' size='sm'>
          <Share2 className='w-4 h-4 mr-2' />
          Share
        </Button>
      </div>
      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Comments</h2>
        {blogPost.comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader>
              <div className='flex items-center space-x-4'>
                <Avatar>
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>{comment.author}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
