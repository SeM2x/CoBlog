import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { createBlog } from '@/lib/actions/blogs';
import { toast } from '@/hooks/use-toast';

interface CreateBlogModalProps {
  isOpen: boolean;
}

export function CreateBlogModal({ isOpen }: CreateBlogModalProps) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(isOpen);

  const onClose = () => {
    setTitle('');
    setOpen(isOpen);
    router.push('/dashboard');
  };

  const router = useRouter();

  const { execute, isPending } = useAction(createBlog, {
    onSuccess: ({ data }) => {
      toast({
        variant: 'default',
        title: 'Blog post created successfully',
      });
      router.push(`/new-blog/${data?.blogId}`);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to create blog post',
      });
    },
  });

  const handleCreate = () => {
    execute({ title });
    setTitle('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
          <DialogDescription>
            Start your new blog post by giving it a title. You can always change
            it later.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='title' className='text-right'>
              Title
            </Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='col-span-3'
              placeholder='Enter your blog title'
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            loading={isPending}
            type='submit'
            onClick={handleCreate}
            disabled={!title.trim()}
          >
            Create Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
