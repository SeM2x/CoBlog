import React, { Suspense } from 'react';
import Dashboard from './dashboard';
import { getFeed } from '@/lib/actions/blogs';

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
  //const isLikes = getBlogReactions(feed[0].id);

  //console.log(isLikes);

  return <Dashboard feed={feed} />;
};
