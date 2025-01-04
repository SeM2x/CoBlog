'use server';

import { z } from 'zod';
import { actionClient } from '../safe-action';
import apiRequest from '../utils/apiRequest';
import { AxiosError } from 'axios';
import storageRequest from '../utils/storageRequest';
import { PartialUser } from '@/types';

const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string(),
  profileUrl: z.string().optional(),
  profilePicture: z.any(),
});

const updateProfile = actionClient
  .schema(profileSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      if (
        data.profilePicture &&
        (data.profilePicture as FormData).get('avatar')
      ) {
        const { success, url } = await uploadImage(data.profilePicture);
        if (!success) return { success: false };

        data.profileUrl = url;
      }
      //console.log(data);

      await apiRequest.put('/users/profile', data);
      return { success: true, profileUrl: data.profileUrl };
    } catch (error) {
      console.log((error as AxiosError).response?.data);
      return { success: false };
    }
  });

const uploadImage = async (formData: FormData) => {
  try {
    const res = (
      await storageRequest.post('/images/upload ', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data;
    return { success: true, url: res?.data?.profileUrl };
  } catch (error) {
    console.log((error as AxiosError).response?.data);
    return { success: false };
  }
};

const getUsers = actionClient
  .schema(z.string())
  .action(async ({ parsedInput: username }) => {
    const res = (await apiRequest.get(`/users/search?username=${username}`))
      .data;
    return res.data as PartialUser[];
  });

const getUserProfile = async (userId: string) => {
  try {
    const res = (await apiRequest.get(`/users/${userId}/profile`)).data;
    return res.data as PartialUser;
    return;
  } catch (error) {
    console.log((error as AxiosError).response?.data);
  }
};

export { updateProfile, getUsers, getUserProfile };
