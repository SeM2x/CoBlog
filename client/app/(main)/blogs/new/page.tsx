'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// const modules = {
//   toolbar: [
//     [{ header: [1, 2, false] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [
//       { list: 'ordered' },
//       { list: 'bullet' },
//       { indent: '-1' },
//       { indent: '+1' },
//     ],
//     ['link', 'image'],
//     ['clean'],
//   ],
// };

// const formats = [
//   'header',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'indent',
//   'link',
//   'image',
// ];

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  // const [content, setContent] = useState('');

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Here you would typically send the blog post to your backend
  //   console.log('Blog post:', { title, content });
  // };

  return (
    <div className='max-w-3xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <form >
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                placeholder='Enter your blog title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='content'>Content</Label>
              {/* <ReactQuill
                theme='snow'
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                className='h-64 mb-12'
              /> */}
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit'>Publish</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
