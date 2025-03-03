'use server';

import { signIn } from '@/auth';
import apiRequest from '../utils/apiRequest';
import { AxiosError } from 'axios';
import { AuthError } from 'next-auth';
import { actionClient } from '../safe-action';
import {
  ForgotPasswordSchema,
  LoginFormSchema,
  ResetPasswordSchema,
  SignupFormSchema,
} from '../form-validation/auth';
import { z } from 'zod';

const register = actionClient
  .schema(SignupFormSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      console.log(data);
      const registerResponse = (
        await apiRequest.post('/auth/create_account', data)
      ).data;
      console.log(registerResponse);

      const { email, password } = data;
      const loginResponse = (
        await apiRequest.post('/auth/sign_in', { email, password })
      ).data;

      const token = loginResponse?.data?.token;
      await signIn('credentials', { token, redirect: false });

      return { user: loginResponse.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        return {
          message:
            (error.response?.data?.message as string) || 'Something went wrong',
        };
      }

      throw error;
    }
  });

const login = actionClient
  .schema(LoginFormSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      const res = (await apiRequest.post('/auth/sign_in', data)).data;
      const token = res?.token;

      await signIn('credentials', { token, redirect: false });
      return { user: res.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          message: error.response?.data.message || 'Something went wrong.',
        };
      }

      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { message: 'Invalid credentials' };
          default:
            return { message: 'Something went wrong' };
        }
      }
      throw error;
    }
  });

const validateToken = async () => {
  try {
    const res = (await apiRequest.get('/notifications/me')).data;
    return { success: true, data: res.data as Notification[] };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.message);
      console.log(error.response?.data);
      return {
        success: false,
        status: error.status,
        message: error.response?.data.message,
      };
    }
  }
};

const sendResetEmail = actionClient
  .schema(ForgotPasswordSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      throw new Error();
      const res = await apiRequest.post('/auth/forgot-password', data);
      return { message: res.data.message };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          message: error.response?.data.message,
        };
      }
      throw new Error('Not implemented');
      return { message: 'Something went wrong' };
    }
  });

const resetPassword = actionClient
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      throw new Error();
      const res = await apiRequest.post('/auth/reset-password', data);
      return { message: res.data.message };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          message: error.response?.data.message,
        };
      }
      throw new Error('Not implemented');
      return { message: 'Something went wrong' };
    }
  });

const validateEmail = actionClient
  .schema(z.string().nonempty())
  .action(async ({ parsedInput: data }) => {
    try {
      throw new Error();
      const res = await apiRequest.post('/auth/reset-password', data);
      return { message: res.data.message };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          message: error.response?.data.message,
        };
      }
      throw new Error('Not implemented');
      return { message: 'Something went wrong' };
    }
  });

export {
  register,
  login,
  validateToken,
  sendResetEmail,
  resetPassword,
  validateEmail,
};
