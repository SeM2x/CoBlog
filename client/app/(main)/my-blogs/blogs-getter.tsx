import { getUserBlogs } from '@/lib/actions/blogs';
import React from 'react';
import Blogs from './blogs';

const BlogsGetter = async () => {
  const { data } = await getUserBlogs();
  return (
    <>
      {data && data.length > 0 ? (
        <Blogs blogs={data} />
      ) : (
        <div className='w-fit m-auto'>No blogs found</div>
      )}
    </>
  );
};

export default BlogsGetter;
