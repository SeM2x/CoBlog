'use server';

import { revalidatePath } from 'next/cache';

const invalidate = async (path: string, type?: 'layout' | 'page') => {
  revalidatePath(path, type);
};

export default invalidate;
