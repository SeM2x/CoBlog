import { getUserBlogs } from '@/lib/actions/blogs';
import React, { Suspense } from 'react';
import CreateBlog from '../CreateBlog';

export default async function CreateBlogPage({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const { id } = await params;
  const blogId = id ? id[0] : undefined;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogsGetter blogId={blogId} />
    </Suspense>
  );
}

const BlogsGetter = async ({ blogId }: { blogId?: string }) => {
  const blogs = (await getUserBlogs()).data;
  const blog = blogs ? blogs.find((blog) => blog._id === blogId) : undefined;

  return <CreateBlog blog={blog} />;
};
