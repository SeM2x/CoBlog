'use server';

import { signIn } from '@/auth';
import apiRequest from '../utils/apiRequest';
import { AxiosError } from 'axios';
import { AuthError } from 'next-auth';
import { actionClient } from '../safe-action';
import {
  EmailSchema,
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

      const token = loginResponse?.token;
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

const verifyAccount = actionClient
  .schema(z.string().nonempty())
  .action(async ({ parsedInput: data }) => {
    try {
      console.log(data);

      throw new Error();
      const res = await apiRequest.post('/auth/verify_account', data);
      return { message: res.data.message };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          message: error.response?.data.message,
        };
      }
      //throw new Error('Not implemented');
      return { message: 'Something went wrong' };
    }
  });

const generateOTP = actionClient
  .schema(EmailSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const res = await apiRequest.post(`/auth/request_token`, { email });
      return { ok: true, data: res.data };
    } catch (error) {
      // if (error instanceof AxiosError) {
      //   return { ok: false, status: error.status };
      // }
      throw error;
    }
  });

const verifyOtp = actionClient
  .schema(
    z.object({ email: z.string().nonempty(), token: z.string().nonempty() })
  )
  .action(async ({ parsedInput: data }) => {
    try {
      const res = await apiRequest.post('/auth/validate_token', data);
      return { message: res.data.message };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw Error(error.response?.data.message);
      }
      throw Error('Something went wrong');
    }
  });

const resetPassword = actionClient
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      const res = await apiRequest.put('/auth/reset_password', data);
      return { message: res.data.message };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          message: error.response?.data.message,
        };
      }
      return { message: 'Something went wrong' };
    }
  });

export {
  register,
  login,
  validateToken,
  resetPassword,
  verifyOtp,
  generateOTP,
  verifyAccount,
};
