'use server';

import { AxiosError } from 'axios';
import apiRequest from '../utils/apiRequest';
import { revalidatePath } from 'next/cache';

const sendMessage = async (data: {
  blogId: string;
  conversationId: string;
  message: string;
}) => {
  try {
    const res = await apiRequest.post('/messages/create', data);
    revalidatePath(`/edit-blog/${data.blogId}`);
    console.log(res.data);
  } catch (error) {
    console.log((error as AxiosError).response?.data);
  }
};

const getMessages = async (conversationId: string) => {
  try {
    const res = (await apiRequest.get(`/messages/${conversationId}`)).data;
    return res.data;
  } catch (error) {
    console.log((error as AxiosError).response?.data);
  }
};

export { sendMessage, getMessages };
