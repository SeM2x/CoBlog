import { Navbar } from '@/components/navbar';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </>
  );
};

export default layout;
