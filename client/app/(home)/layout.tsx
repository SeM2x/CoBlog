import { Navbar } from './navbar';
import React from 'react';

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default layout;
