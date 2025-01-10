import { getBlog } from '@/lib/actions/blogs';
import React, { Suspense } from 'react';
import CreateBlog from '../EditBlog';
import { CoAuthor, PartialUser } from '@/types';
import { getMessages } from '@/lib/actions/messages';

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

const BlogsGetter = async ({ blogId }: { blogId?: string }) => {
  if (!blogId) return null;
  const blog = (await getBlog(blogId)).data;
  const coAuthors = blog?.CoAuthors || [];
  const author = {
    id: blog?.authorId,
    username: blog?.authorUsername,
    profileUrl: blog?.authorProfileUrl,
    role: 'author',
  } as CoAuthor;

  const invitedUsers = [] as PartialUser[];

  const messages = blog?.conversationId
    ? await getMessages(blog?.conversationId)
    : [];
  return (
    <CreateBlog
      blog={blog}
      coAuthors={[author, ...coAuthors]}
      invitedUsers={invitedUsers}
      messages={messages}
    />
  );
};
