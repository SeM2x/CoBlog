'use server';

import { AxiosError } from 'axios';
import apiRequest from '../utils/apiRequest';
import { revalidatePath } from 'next/cache';
import socket from '@/socket';
import { SocketEvents } from '../socketEvents';

const sendMessage = async (data: {
  blogId: string;
  conversationId: string;
  message: string;
}) => {
  try {
    const res = await apiRequest.post('/messages/create', data);
    console.log(data);
    socket.emit(SocketEvents.SEND_MESSAGE, data.blogId);
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
