import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CardContent } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import { TopicSelector } from './TopicsSelector';
import { Blog } from '@/types';
import usePublish from '@/hooks/usePublish';
import { useAction } from 'next-safe-action/hooks';
import { saveBlog } from '@/lib/actions/blogs';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { topics } from '@/lib/mock';
import { useState } from 'react';

interface PublishBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  selectedTopics: { value: string; label: string }[];
  setSelectedTopics: (topics: { value: string; label: string }[]) => void;
  coverImage: string | null;
  setCoverImage: (image: string | null) => void;
  onPublish: () => void;
  blog: Blog | undefined;
}

export function PublishBlogModal({
  isOpen,
  onClose,
  title,
  content,
  selectedTopics,
  setSelectedTopics,
  coverImage,
  setCoverImage,
  onPublish,
  blog,
}: PublishBlogModalProps) {
  const [selectedSubtopics, setSelectedSubtopics] = useState<
    { value: string; label: string }[]
  >([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { handlePublish, isPublishPending } = usePublish({
    blogId: blog?._id,
    title,
    content,
    topics: selectedTopics.map((topic) => topic.value),
    subtopics: selectedSubtopics.map((subtopic) => subtopic.value),
    onSuccess: onPublish,
  });

  const router = useRouter();

  const { execute: executeSave, isPending: isSavePending } = useAction(
    saveBlog,
    {
      onSuccess: ({ data }) => {
        toast({ title: data });
        router.push(`/blogs/${blog?._id}`);
        onPublish();
      },
      onError: ({ error: { serverError } }) => {
        if (serverError) toast({ title: serverError, variant: 'destructive' });
      },
    }
  );

  const handleSave = () => {
    if (!blog) return;
    const data = {
      blogId: blog?._id,
      title,
      content,
      topics: [],
      subtopics: [],
    };
    console.log('data', data);
    executeSave(data);
  };

  return (
    <Dialog modal={false} open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Publish Blog Post</DialogTitle>
        </DialogHeader>

        <CardContent className='space-y-4 pt-4'>
          <TopicSelector
            topics={topics.map((topic) => ({
              value: topic._id,
              label: topic.name,
            }))}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
          />
          <TopicSelector
            topics={topics
              .map((topic) => topic.subtopics)
              .flat()
              .map((subtopic) => ({
                value: subtopic.slug,
                label: subtopic.name,
              }))}
            selectedTopics={selectedSubtopics}
            setSelectedTopics={setSelectedSubtopics}
            title='Add subtopic'
          />
        </CardContent>

        <CardContent>
          <div className='flex items-center justify-center w-full'>
            {coverImage ? (
              <div className='relative w-full h-48'>
                <Image
                  src={coverImage || '/placeholder.svg'}
                  alt='Cover'
                  className='w-full h-full object-cover rounded-md'
                  fill
                />
                <Button
                  variant='secondary'
                  size='sm'
                  className='absolute top-2 right-2'
                  onClick={() => setCoverImage(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Label
                htmlFor='cover-image-upload'
                className='flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
              >
                <ImageIcon className='w-12 h-12 text-gray-400' />
                <span className='mt-2 text-sm'>Upload cover image</span>
                <Input
                  id='cover-image-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageUpload}
                />
              </Label>
            )}
          </div>
        </CardContent>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          {blog?.status === 'published' ? (
            <Button
              disabled={
                !content ||
                !title ||
                (content === blog.content && title === blog.title)
              }
              onClick={handleSave}
              loading={isSavePending}
            >
              Save & Publish
            </Button>
          ) : (
            <Button
              disabled={!content || !title}
              onClick={handlePublish}
              loading={isPublishPending}
            >
              Publish
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
