import React, { Suspense } from 'react';
import SearchPage from './search';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const keyword = (await searchParams).keyword;
  return (
    <Suspense key={keyword} fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
};

export default page;
