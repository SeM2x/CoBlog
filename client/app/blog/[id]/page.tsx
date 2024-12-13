'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';

// Mock function to fetch blog data
const fetchBlog = async (id: string) => {
  // In a real app, this would be an API call
  return {
    title: 'Sample Blog Post',
    content: '<p>This is a sample blog post content.</p>',
  };
};

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });
  const { toast } = useToast();
  const params = useParams();

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blog = await fetchBlog(params.id as string);
        setTitle(blog.title);
        editor?.commands.setContent(blog.content);
      } catch (error) {
        console.error('Error loading blog:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog content',
          variant: 'destructive',
        });
      }
    };

    if (params.id !== 'new') {
      loadBlog();
    }
  }, [params.id, editor, toast]);

  const handleSave = async () => {
    // In a real app, this would be an API call to save the blog
    console.log('Saving blog:', { title, content: editor?.getHTML() });
    toast({
      title: 'Success',
      description: 'Blog saved successfully',
    });
  };

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>
        {params.id === 'new' ? 'Create New Blog' : 'Edit Blog'}
      </h1>
      <div>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter blog title'
        />
      </div>
      <div>
        <Label>Content</Label>
        <EditorContent
          editor={editor}
          className='border p-4 rounded-md min-h-[200px]'
        />
      </div>
      <Button onClick={handleSave}>Save Blog</Button>
    </div>
  );
}
