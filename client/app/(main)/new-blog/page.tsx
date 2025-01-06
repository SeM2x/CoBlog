import React, { Suspense } from 'react';
import CreateBlog from '../edit-blog/CreateBlog';

export default async function CreateBlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateBlog blog={undefined} coAuthors={[]} invitedUsers={[]} />
    </Suspense>
  );
}
