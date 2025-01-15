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

import { Edit, Trash2, MoreHorizontal, Globe, Eye } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import useDeleteBlog from '@/hooks/useDeleteBlog';
import usePublish from '@/hooks/usePublish';

const BlogCard = ({ blog }: { blog: Blog }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { handleDelete, isPending } = useDeleteBlog({
    blogId: blog._id,
    onClose: () => setIsDeleteDialogOpen(false),
  });

  const { handlePublish, isPublishPending } = usePublish({
    blogId: blog._id,
    title: blog.title,
    content: blog.content,
  });

  return (
    <>
      <Card className='mb-4 shadow-none'>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <Link href={`/blogs/${blog._id}`} passHref>
                <CardTitle className='text-xl line-clamp-1'>
                  {blog.title}
                </CardTitle>
              </Link>
              <CardDescription
                className='mt-2 line-clamp-2'
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
            <Badge
              variant={blog.status === 'published' ? 'default' : 'secondary'}
            >
              {blog.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between text-sm text-muted-foreground'>
            <span>{format(blog.createdAt, 'dd-mm-yyyy')}</span>
            {blog.status === 'published' && (
              <span>0 views • {blog.nComments} comments</span>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Link href={`/edit-blog/${blog._id}`}>
            <Button variant='outline'>
              <Edit className='mr-2 h-4 w-4' /> Edit
            </Button>
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {blog.status === 'draft' && (
                <DropdownMenuItem
                  onClick={handlePublish}
                  disabled={isPublishPending || !blog.content || !blog.title}
                  aria-disabled={
                    isPublishPending || !blog.content || !blog.title
                  }
                >
                  <Globe className='mr-2 h-4 w-4' /> Publish
                </DropdownMenuItem>
              )}
              {blog.status === 'published' && (
                <Link href={`/blogs/${blog._id}`} passHref>
                  <DropdownMenuItem>
                    <Eye className='mr-2 h-4 w-4' /> View
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuItem
                className='text-red-500 hover:!text-red-500 hover:!bg-red-500/10'
                onSelect={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className='mr-2 h-4 w-4' /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <Button
              variant='destructive'
              loading={isPending}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogCard;
