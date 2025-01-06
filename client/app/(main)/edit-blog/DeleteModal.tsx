import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { deleteBlog } from '@/lib/actions/blogs';
import { useAction } from 'next-safe-action/hooks';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const DeleteModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();

  const { executeAsync, isPending } = useAction(deleteBlog, {
    onSuccess: ({ data }) => {
      toast({ title: data });
      router.push('/new-blog');
      onClose();
    },

    onError: () => {
      toast({ title: 'Failed to delete blog post', variant: 'destructive' });
    },
  });
  const params = useParams();

  const handleDelete = async () => {
    await executeAsync(params.id ? params.id[0] : '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Blog Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this blog post? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={isPending}
            variant='destructive'
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
