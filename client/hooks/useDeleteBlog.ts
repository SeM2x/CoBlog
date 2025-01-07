import { deleteBlog } from '@/lib/actions/blogs';
import { useAction } from 'next-safe-action/hooks';
import { toast } from './use-toast';
import { useRouter } from 'next/navigation';

const useDeleteBlog = ({
  blogId,
  onClose,
}: {
  blogId?: string;
  onClose?: () => void;
}) => {
  const router = useRouter();

  const { executeAsync, isPending } = useAction(deleteBlog, {
    onSuccess: ({ data }) => {
      toast({ title: data });
      router.push('/my-blogs');
      if (onClose) onClose();
    },

    onError: () => {
      toast({ title: 'Failed to delete blog post', variant: 'destructive' });
    },
  });

  const handleDelete = async () => {
    if (blogId) await executeAsync(blogId);
  };

  return { handleDelete, isPending };
};

export default useDeleteBlog;
