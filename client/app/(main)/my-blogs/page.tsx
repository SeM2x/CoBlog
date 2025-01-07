import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React, { Suspense } from 'react';
import BlogsGetter from './blogs-getter';
import Link from 'next/link';

const MyBlogsPage = async () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>My Blogs</h1>
        <Link href='/new-blog'>
          <Button>
            <Plus className='mr-2 h-4 w-4' /> New Blog Post
          </Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogsGetter />
      </Suspense>
    </div>
  );
};

export default MyBlogsPage;
