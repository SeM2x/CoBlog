'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TipTapEditor from '@/components/tiptap';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { BlogChat } from './blogChat';
import { CreateBlogModal } from '@/components/createBlogModal';
import { Blog } from '@/types';
import { useUserStore } from '@/lib/store';
import generateTipTapToken from '@/lib/utils/tiptap-token';
import DynamicTextarea from './DynamicTextarea';

const currentUser = {
  id: '1',
  name: 'John Doe',
  avatar: '/avatars/john-doe.jpg',
};

const collaborators = [
  { id: '2', name: 'Alice Johnson', avatar: '/avatars/alice-johnson.jpg' },
  { id: '3', name: 'Bob Smith', avatar: '/avatars/bob-smith.jpg' },
  { id: '4', name: 'Charlie Brown', avatar: '/avatars/charlie-brown.jpg' },
];

export default function CreateBlog({ blog }: { blog?: Blog }) {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');

  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
  const [doc, setDoc] = useState<Y.Doc | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the blog post to your backend
    console.log('Blog post:', { title, content });
  };

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      console.log('blog', blog.content);
    }
  }, [blog]);

  useEffect(() => {
    if (blog && user) {
      const createProvider = async () => {
        const secret = process.env.NEXT_PUBLIC_TIPTAP_APP_SECRET || '';
        const token = await generateTipTapToken(user.id, secret);
        //console.log('token', token);
        const doc = new Y.Doc();
        const provider = new TiptapCollabProvider({
          name: blog._id,
          appId: process.env.NEXT_PUBLIC_TIPTAP_APP_ID || '',
          token,
          document: doc,
        });
        setDoc(doc);
        setProvider(provider);
      };

      createProvider();
    }
  }, [blog, user]);

  useEffect(() => {
    if (provider && user) {
      provider.setAwarenessField('user', {
        name: user.username,
      });
    }
  }, [provider, user]);

  return (
    <div className='relative container mx-auto px-4 py-8 max-w-4xl space-y-4'>
      <CreateBlogModal isOpen={!blog} />
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader className='flex flex-row justify-between items-center'>
            <CardTitle>Create New Blog</CardTitle>
            <Button type='submit'>Publish</Button>
          </CardHeader>
          <CardContent className='space-y-4'>
          <DynamicTextarea 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
          </CardContent>
        </form>
      </Card>
      <div className='space-y-2'>
        {provider && doc && (
          <TipTapEditor
            provider={provider}
            doc={doc}
            content={content}
            onChange={setContent}
          />
        )}
      </div>
      {blog && (
        <BlogChat
          blog={blog}
          currentUser={currentUser}
          collaborators={collaborators}
        />
      )}
    </div>
  );
}
