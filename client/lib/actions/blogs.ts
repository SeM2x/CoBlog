'use server';

import { AxiosError } from 'axios';
import apiRequest from '../utils/apiRequest';
import { Blog, Comment, FeedPost } from '@/types';
import { actionClient } from '../safe-action';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import getServerError from '../utils/getServerError';
import { markNotificationRead } from './notifications';

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
    try {
      const res = (await apiRequest.put(`/blogs/${blogId}/invite`, { users }))
        .data;
      return res.message;
    } catch (error) {
      throw getServerError(error);
    }
  });

const invitationResponseSchema = z.object({
  notificationId: z.string().nonempty(),
  blogId: z.string().nonempty(),
});

const acceptCollaboration = actionClient
  .schema(invitationResponseSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      const res = (await apiRequest.put(`/blogs/accept`, data)).data;
      await markNotificationRead(data.notificationId);
      revalidatePath('/', 'layout');
      revalidatePath('/notifications');
      return res.message;
    } catch (error) {
      throw getServerError(error);
    }
  });

const rejectCollaboration = actionClient
  .schema(invitationResponseSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      const res = (await apiRequest.put(`/blogs/reject`, data)).data;
      await markNotificationRead(data.notificationId);
      revalidatePath('/', 'layout');
      revalidatePath('/notifications');
      return res.message;
    } catch (error) {
      throw getServerError(error);
    }
  });

const getBlog = async (blogId: string) => {
  try {
    const res = (await apiRequest(`/blogs/${blogId}`)).data;
    return { success: true, data: res.data as Blog };
  } catch (error) {
    const message = (
      (error as AxiosError).response?.data as { message: string }
    )?.message;
    return {
      success: false,
      message: message || 'Failed to fetch blog',
    };
  }
};

const deleteBlog = actionClient
  .schema(z.string().nonempty())
  .action(async ({ parsedInput: blogId }) => {
    const res = (await apiRequest.delete(`/blogs/${blogId}/delete`)).data;
    revalidatePath('/edit-blog');
    revalidatePath('/my-blogs');
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
    try {
      const { blogId, ...data } = parsedInput;
      const res = (await apiRequest.put(`/blogs/${blogId}/publish`, data)).data;
      return res.message;
    } catch (error) {
      throw getServerError(error);
    }
  });

const saveBlog = actionClient
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
    try {
      const { blogId, ...data } = parsedInput;
      const res = (await apiRequest.put(`/blogs/${blogId}/save`, data)).data;
      return res.message;
    } catch (error) {
      throw getServerError(error);
    }
  });

const getFeed = async () => {
  try {
    const res = (await apiRequest('/blogs/feed')).data;
    return res.data as FeedPost[];
  } catch (error) {
    console.log((error as AxiosError).response?.data || error);
  }
};

const getBlogComments = async (blogId: string) => {
  try {
    const res = (await apiRequest(`/blogs/${blogId}/comments`)).data;
    return res.data as Comment[];
  } catch (error) {
    console.log((error as AxiosError).response?.data || error);
  }
};

const createComment = actionClient
  .schema(
    z.object({
      blogId: z.string().nonempty(),
      content: z.string().nonempty(),
    })
  )
  .action(async ({ parsedInput }) => {
    try {
      const res = (
        await apiRequest.post(
          `/blogs/${parsedInput.blogId}/comment`,
          parsedInput
        )
      ).data;
      revalidatePath(`/blogs/${parsedInput.blogId}`);
      return res.data as Comment;
    } catch (error) {
      throw getServerError(error);
    }
  });

const toggleBlogLike = async (blogId: string) => {
  try {
    const res = (await apiRequest.put(`/blogs/${blogId}/react`)).data;
    revalidatePath(`/blogs/${blogId}`);
    return res.data as Comment[];
  } catch (error) {
    console.log((error as AxiosError).response?.data || error);
  }
};

const getBlogReactions = async (blogId: string) => {
  try {
    const res = (await apiRequest.get(`/blogs/${blogId}/react`)).data;
    return res.data as { isLike: boolean; isBookmark: boolean };
  } catch (error) {
    console.log((error as AxiosError).response?.data || error);
  }
};

const getUserCoAuthoredBlogs = async () => {
  try {
    const res = (await apiRequest('/blogs/co-authored')).data;
    return { success: true, data: res.data as Blog[] };
  } catch (error) {
    console.log((error as AxiosError).response?.data || error);
    return { success: false, message: 'Failed to fetch blogs' };
  }
};

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
  saveBlog,
  getFeed,
  getBlogComments,
  createComment,
  toggleBlogLike,
  getBlogReactions,
  getUserCoAuthoredBlogs,
};
