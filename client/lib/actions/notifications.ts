'use server';

import { Notification } from '@/types';
import apiRequest from '../utils/apiRequest';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { actionClient } from '../safe-action';
import { z } from 'zod';

const getNotifications = async () => {
  try {
    const res = (await apiRequest.get('/notifications/me')).data;
    return res.data as Notification[];
  } catch (error) {
    console.log((error as AxiosError).message);
    console.log((error as AxiosError).response?.data);
  }
};

const markNotificationRead = async (id: string) => {
  try {
    const res = (await apiRequest.put(`/notifications/${id}`)).data;
    console.log(res);
    revalidatePath('/', 'layout');
    revalidatePath('/notifications');
  } catch (error) {
    console.log((error as AxiosError).message);
    console.log((error as AxiosError).response?.data);
    return id;
  }
};

const deleteNotification = actionClient
  .schema(z.string().nonempty())
  .action(async ({ parsedInput: id }) => {
    try {
      const res = (await apiRequest.delete(`/notifications/${id}`)).data;
      console.log(res);
      revalidatePath('/', 'layout');
      revalidatePath('/notifications');
    } catch (error) {
      console.log((error as AxiosError).message);
      console.log((error as AxiosError).response?.data);
      return id;
    }
  });

export { getNotifications, markNotificationRead, deleteNotification };
