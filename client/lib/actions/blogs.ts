'use server';

import { AxiosError } from 'axios';
import apiRequest from '../utils/apiRequest';
import { Blog } from '@/types';

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

export { getTopics, getUserBlogs };
