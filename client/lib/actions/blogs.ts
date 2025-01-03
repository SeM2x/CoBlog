'use server';

import { AxiosError } from 'axios';
import apiRequest from '../utils/apiRequest';
import { Blog } from '@/types';
import { actionClient } from '../safe-action';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const getTopics = async () => {
  try {
    const res = (await apiRequest('/blogs/topics')).data;
    return { success: true, data: res.data };
  } catch (error) {
    console.log((error as AxiosError).response?.data || error);
    return { success: false, message: 'Failed to fetch topics' };
  }
};

const getUserBlogs = async () => {
  try {
    const res = (await apiRequest('/blogs/me')).data;
    return { success: true, data: res.data as Blog[] };
  } catch (error) {
    console.log((error as AxiosError).response?.data || error);
    return { success: false, message: 'Failed to fetch blogs' };
  }
};

const createBlog = actionClient
  .schema(
    z.object({
      title: z.string().nonempty(),
    })
  )
  .action(async ({ parsedInput: data }) => {
    const res = (await apiRequest.post('/blogs/create', data)).data;
    revalidatePath('/new-blog');
    return res.data as Partial<Blog>;
  });

const inviteCollaborator = actionClient
  .schema(
    z.object({
      blogId: z.string().nonempty(),
      users: z.array(z.string().nonempty()),
    })
  )
  .action(async ({ parsedInput: { blogId, users } }) => {
    const res = (await apiRequest.put(`/blogs/${blogId}/invite`, { users }))
      .data;
    return res.message;
  });
export { getTopics, getUserBlogs, createBlog, inviteCollaborator };
