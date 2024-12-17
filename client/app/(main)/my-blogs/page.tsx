'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, MoreVertical, Search, Plus } from 'lucide-react';

// Mock data for blogs
const blogs = [
  {
    id: 1,
    title: 'Getting Started with Next.js 14',
    excerpt: 'Learn how to build modern web applications with Next.js 14...',
    status: 'published',
    date: '2023-05-15',
    views: 1200,
    comments: 15,
  },
  {
    id: 2,
    title: 'Mastering TypeScript for React Development',
    excerpt: 'Discover how TypeScript can improve your React development...',
    status: 'published',
    date: '2023-05-12',
    views: 980,
    comments: 22,
  },
  {
    id: 3,
    title: 'Building Responsive UIs with Tailwind CSS',
    excerpt: 'Learn how to create beautiful and responsive user interfaces...',
    status: 'draft',
    date: '2023-05-10',
    views: 0,
    comments: 0,
  },
  {
    id: 4,
    title: 'Advanced React Hooks',
    excerpt: 'Dive deep into React Hooks and learn advanced patterns...',
    status: 'draft',
    date: '2023-05-08',
    views: 0,
    comments: 0,
  },
];

export default function MyBlogsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  const filteredBlogs = blogs.filter(
    (blog) =>
      (activeTab === 'all' || blog.status === activeTab) &&
      (blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id: number) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Here you would typically call an API to delete the blog
    console.log(`Deleting blog with id: ${blogToDelete}`);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>My Blogs</h1>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> New Blog Post
        </Button>
      </div>

      <div className='flex justify-between items-center mb-6'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='published'>Published</TabsTrigger>
            <TabsTrigger value='draft'>Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='relative w-64'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
          <Input
            placeholder='Search blogs...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-8'
          />
        </div>
      </div>

      <div className='space-y-4'>
        {filteredBlogs.map((blog) => (
          <Card key={blog.id}>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle>{blog.title}</CardTitle>
                  <CardDescription>{blog.excerpt}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>
                      <Link
                        href={`/edit-blog/${blog.id}`}
                        className='flex items-center'
                      >
                        <Edit className='mr-2 h-4 w-4' /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(blog.id)}>
                      <Trash2 className='mr-2 h-4 w-4' /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex justify-between text-sm text-gray-500'>
                <span>{blog.date}</span>
                <span>
                  {blog.status === 'published'
                    ? `${blog.views} views • ${blog.comments} comments`
                    : 'Draft'}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex justify-between items-center w-full'>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id={`publish-${blog.id}`}
                    checked={blog.status === 'published'}
                  />
                  <Label htmlFor={`publish-${blog.id}`}>
                    {blog.status === 'published' ? 'Published' : 'Draft'}
                  </Label>
                </div>
                <Button variant='outline'>Preview</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this blog post?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              blog post and remove the data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
