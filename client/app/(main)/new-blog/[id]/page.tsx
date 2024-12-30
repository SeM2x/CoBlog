'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TipTapEditor from '@/components/tiptap';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

const doc = new Y.Doc();

const provider = new TiptapCollabProvider({
  name: 'document.name', // Unique document identifier for syncing. This is your document name.
  appId: process.env.NEXT_PUBLIC_APP_ID || '', // Your Cloud Dashboard AppID or `baseURL` for on-premises
  token: process.env.NEXT_PUBLIC_APP_TOKEN, // Your Cloud Dashboard App Token
  document: doc,
});

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the blog post to your backend
    console.log('Blog post:', { title, content });
  };

  return (
    <div className='relative container mx-auto px-4 py-8 max-w-4xl space-y-4'>
      <Card>
        <CardHeader className='flex flex-row justify-between items-center'>
          <CardTitle>Create New Blog</CardTitle>
          <Button type='submit'>Publish</Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <Input
              id='title'
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='!text-5xl font-semibold h-fit border-none shadow-none focus-visible:ring-0 placeholder:text-gray-300 dark:placeholder-gray-500'
            />
          </CardContent>
        </form>
      </Card>
      <div className='space-y-2'>
        <TipTapEditor
          provider={provider}
          doc={doc}
          content={content}
          onChange={setContent}
        />
      </div>
    </div>
  );
}
