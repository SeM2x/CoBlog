import { publishBlog } from '@/lib/actions/blogs';
import { useAction } from 'next-safe-action/hooks';
import { toast } from './use-toast';
import { useRouter } from 'next/navigation';

const usePublish = ({
  blogId,
  title,
  content,
  onSuccess,
  topics,
  subtopics,
}: {
  blogId?: string;
  title: string;
  content: string;
  onSuccess?: () => void;
  topics: string[]; 
  subtopics: string[];
}) => {
  const router = useRouter();
  const { execute: executePublish, isPending: isPublishPending } = useAction(
    publishBlog,
    {
      onSuccess: ({ data }) => {
        toast({ title: data });
        router.push(`/blogs/${blogId}`);
        if (onSuccess) onSuccess();
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
      topics,
      subtopics,
    };
    console.log('data', data);
    executePublish(data);
  };
  return { handlePublish, isPublishPending };
};

export default usePublish;
