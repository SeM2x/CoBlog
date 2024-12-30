'use server';

import { AxiosError } from 'axios';
import apiRequest from '../utils/apiRequest';

const getTopics = async () => {
  try {
    const res = (await apiRequest('/blogs/topics')).data;
    return { success: true, data: res.data };
  } catch (error) {
    console.log((error as AxiosError).response?.data || error);
    return { success: false, message: 'Failed to fetch topics' };
  }
};

export { getTopics };
