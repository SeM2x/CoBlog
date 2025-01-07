import React, { Suspense } from 'react';
import SearchPage from './search';

const page = async () => {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
};

export default page;
