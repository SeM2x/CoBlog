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
    revalidatePath(`/new-blog/${res.data._id}`);
    revalidatePath('/(main)/new-blog/[[...id]]');
    return res.data as Partial<Blog>;
  });

const inviteCollaborator = actionClient
  .schema(
    z.object({
      blogId: z.string().nonempty(),
      users: z.array(
        z.object({
          id: z.string().nonempty(),
          role: z.string().nonempty().optional(),
        })
      ),
    })
  )
  .action(async ({ parsedInput: { blogId, users } }) => {
    const res = (await apiRequest.put(`/blogs/${blogId}/invite`, { users }))
      .data;
    return res.message;
  });

const acceptCollaboration = actionClient
  .schema(z.string().nonempty())
  .action(async ({ parsedInput: blogId }) => {
    const res = (await apiRequest.put(`/blogs/accept`, { blogId })).data;
    return res.message;
  });

const rejectCollaboration = actionClient
  .schema(z.string().nonempty())
  .action(async ({ parsedInput: blogId }) => {
    const res = (await apiRequest.put(`/blogs/reject`, { blogId })).data;
    return res.message;
  });

const getBlog = async (blogId: string) => {
  try {
    const res = (await apiRequest(`/blogs/${blogId}`)).data;
    return { success: true, data: res.data as Blog };
  } catch (error) {
    console.log((error as AxiosError).response?.data || error);
    return { success: false, message: 'Failed to fetch blog' };
  }
};

const deleteBlog = actionClient
  .schema(z.string().nonempty())
  .action(async ({ parsedInput: blogId }) => {
    const res = (await apiRequest.delete(`/blogs/${blogId}/delete`)).data;
    revalidatePath('/new-blog');
    revalidatePath('/(main)/new-blog/[[...id]]');
    return res.message;
  });

const publishBlog = actionClient
  .schema(
    z.object({
      blogId: z.string().nonempty(),
      title: z.string().nonempty(),
      content: z.string().nonempty(),
      topics: z.array(z.string().nonempty()),
      subtopics: z.array(z.string().nonempty()),
    })
  )
  .action(async ({ parsedInput }) => {
    const { blogId, ...data } = parsedInput;
    const res = (await apiRequest.put(`/blogs/${blogId}/publish`, data)).data;
    return res.message;
  });

export {
  getTopics,
  getUserBlogs,
  createBlog,
  inviteCollaborator,
  acceptCollaboration,
  rejectCollaboration,
  getBlog,
  deleteBlog,
  publishBlog,
};
