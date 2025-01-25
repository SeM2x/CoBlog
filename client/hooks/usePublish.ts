import { publishBlog } from '@/lib/actions/blogs';
import { useAction } from 'next-safe-action/hooks';
import { toast } from './use-toast';
import { useRouter } from 'next/navigation';

const usePublish = ({
  blogId,
  title,
  content,
}: {
  blogId?: string;
  title: string;
  content: string;
}) => {
  const router = useRouter();
  const { execute: executePublish, isPending: isPublishPending } = useAction(
    publishBlog,
    {
      onSuccess: ({ data }) => {
        toast({ title: data });
        router.push(`/blogs/${blogId}`);
      },
      onError: ({ error: { serverError } }) => {
        if (serverError) toast({ title: serverError, variant: 'destructive' });
      },
    }
  );

  const handlePublish = () => {
    if (!blogId) return;
    const data = {
      blogId,
      title,
      content,
      topics: [],
      subtopics: [],
    };
    console.log('data', data);
    executePublish(data);
  };
  return { handlePublish, isPublishPending };
};

export default usePublish;
