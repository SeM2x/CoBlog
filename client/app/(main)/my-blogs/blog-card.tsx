'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Blog } from '@/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BlogCard = ({ blog }: { blog: Blog }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Here you would typically call an API to delete the blog
    console.log(`Deleting blog with id: ${blogToDelete}`);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card key={blog._id}>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div className='space-y-2'>
              <CardTitle>{blog.title}</CardTitle>
              <CardDescription className=' line-clamp-3'>{blog.content}</CardDescription>
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
                    href={`/new-blog/${blog._id}`}
                    className='flex items-center w-full'
                  >
                    <Edit className='mr-2 h-4 w-4' /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(blog._id)}>
                  <Trash2 className='mr-2 h-4 w-4' /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between text-sm text-gray-500'>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>
              {blog.status === 'published'
                ? `0 views • ${blog.nComments} comments`
                : 'Draft'}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <div className='flex justify-between items-center w-full'>
            <div className='flex items-center space-x-2'>
              <Switch
                id={`publish-${blog._id}`}
                checked={blog.status === 'published'}
              />
              <Label htmlFor={`publish-${blog._id}`}>
                {blog.status === 'published' ? 'Published' : 'Draft'}
              </Label>
            </div>
            <Button variant='outline'>Preview</Button>
          </div>
        </CardFooter>
      </Card>
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
    </>
  );
};

export default BlogCard;
