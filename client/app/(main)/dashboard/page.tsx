import React, { Suspense } from 'react';
import Dashboard from './dashboard';
import { getBlogReactions, getFeed } from '@/lib/actions/blogs';
import { FeedPost } from '@/types';

const DashboardPage = async () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Feed />
    </Suspense>
  );
};

export default DashboardPage;

const Feed = async () => {
  const feed = (await getFeed()) || [];
  const feedWithReactions: FeedPost[] = await Promise.all(
    feed.map(async (post) => {
      return { ...post, ...(await getBlogReactions(post.id)) };
    })
  );

  return <Dashboard feed={feedWithReactions} />;
};
