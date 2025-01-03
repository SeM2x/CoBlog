'use server';

import { Notification } from '@/types';
import apiRequest from '../utils/apiRequest';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

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
    revalidatePath('/notifications');
  } catch (error) {
    console.log((error as AxiosError).message);
    console.log((error as AxiosError).response?.data);
    return id;
  }
};

export { getNotifications, markNotificationRead };
