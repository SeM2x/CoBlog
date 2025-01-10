'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Search } from 'lucide-react';
import { Blog } from '@/types';
import BlogCard from './blog-card';

export default function Blogs({
  blogs,
  coblogs,
}: {
  blogs?: Blog[];
  coblogs?: Blog[];
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs =
    blogs?.filter(
      (blog) =>
        (activeTab === 'all' || blog.status === activeTab) &&
        (blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  const filteredCoblogs =
    coblogs?.filter(
      (blog) =>
        activeTab === 'co-authored' &&
        (blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='co-authored'>Co-Authored</TabsTrigger>
            <TabsTrigger value='published'>Published</TabsTrigger>
            <TabsTrigger value='draft'>Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='relative w-64'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
          <Input
            placeholder='Search blogs...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-8'
          />
        </div>
      </div>

      <div className='space-y-4'>
        {[...filteredBlogs, ...filteredCoblogs].length === 0 ? (
          <div className='w-fit m-auto'>No blogs found</div>
        ) : (
          [...filteredBlogs, ...filteredCoblogs].map((blog) => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>
    </>
  );
}
