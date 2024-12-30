import { auth } from '@/auth';
import axios from 'axios';

const storageRequest = axios.create({
  baseURL: process.env.STORAGE_SERVER_URL || 'https://storage.techerudites.tech',
});

storageRequest.interceptors.request.use(
  async (config) => {
    const session = await auth();
    const accessToken = session?.user?.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default storageRequest;
