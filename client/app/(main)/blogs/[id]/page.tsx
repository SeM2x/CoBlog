import { getBlog, getBlogComments } from '@/lib/actions/blogs';
import React, { Suspense } from 'react';
import BlogDetails from '../blogs';

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: blogId } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogGetter blogId={blogId} />
    </Suspense>
  );
};

export default BlogPage;

const BlogGetter = async ({ blogId }: { blogId: string }) => {
  const blog = await getBlog(blogId);
  const comments = (await getBlogComments(blogId)) || [];
  return (
    <BlogDetails blog={blog.data} comments={comments} error={blog.message} />
  );
};
