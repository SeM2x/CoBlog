import { getBlog, getUserBlogs } from '@/lib/actions/blogs';
import React, { Suspense } from 'react';
import CreateBlog from '../CreateBlog';
import { getUserProfile } from '@/lib/actions/users';

export default async function CreateBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blogId = id;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogsGetter blogId={blogId} />
    </Suspense>
  );
}

const getUsersProfiles = async (userIds: string[]) => {
  return (await Promise.all(userIds.map((id) => getUserProfile(id)))).filter(
    (user) => user !== undefined
  );
};

const BlogsGetter = async ({ blogId }: { blogId?: string }) => {
  if (blogId) console.log('fetching blog', (await getBlog(blogId)).data?.title);
  const blogs = (await getUserBlogs()).data;

  const blog = blogs ? blogs.find((blog) => blog._id === blogId) : undefined;
  const coAuthors = await getUsersProfiles(blog?.CoAuthors || []);
  const invitedUsers = await getUsersProfiles(blog?.invitedUsers || []);

  return (
    <CreateBlog blog={blog} coAuthors={coAuthors} invitedUsers={invitedUsers} />
  );
};
