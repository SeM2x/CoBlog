import { getUserBlogs, getUserCoAuthoredBlogs } from '@/lib/actions/blogs';
import React from 'react';
import Blogs from './blogs';

const BlogsGetter = async () => {
  const { data: blogs } = await getUserBlogs();
  const { data: coblogs } = await getUserCoAuthoredBlogs();

  console.log(coblogs);

  return <Blogs blogs={blogs} coblogs={coblogs} />;
};

export default BlogsGetter;
