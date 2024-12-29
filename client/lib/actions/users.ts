'use server';

import { z } from 'zod';
import { actionClient } from '../safe-action';
import apiRequest from '../utils/apiRequest';
import { AxiosError } from 'axios';

const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string(),
  profileUrl: z.string(),
});

const updateProfile = actionClient
  .schema(profileSchema)

  .action(async ({ parsedInput: data }) => {
    try {
      console.log(data);
      
      await apiRequest.put('/users/profile', data);
      return { success: true };
    } catch (error) {
      console.log((error as AxiosError).response?.data);
      return { success: false };
    }
  });

export { updateProfile };
