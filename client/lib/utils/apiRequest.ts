import { auth } from '@/auth';
import axios from 'axios';

const apiRequest = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000/api/',
});

apiRequest.interceptors.request.use(
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

export default apiRequest;
