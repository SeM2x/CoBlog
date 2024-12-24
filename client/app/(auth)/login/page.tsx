'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/actions/auth';
import { useUserStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { setLocalUser } from '@/lib/utils/local-storage';
import { useAction } from 'next-safe-action/hooks';
import { LoginFormSchema } from '@/lib/form-validation/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const { execute, isPending } = useAction(login, {
    onSettled: ({ result: { data } }) => {
      if (data?.user) {
        setLocalUser(data?.user);
        setUser(data?.user);
        router.push('/dashboard');
      }
      if (data?.message) {
        setError(data?.message);
      }
    },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    execute({ email: values.email, password: values.password });
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Welcome back to CoBlog!
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Enter your password'
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='rememberMe'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Remember me</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {error && <FormMessage className='text-sm'>{error}</FormMessage>}
              <Button loading={isPending} type='submit' className='w-full'>
                Log in
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-2'>
          <Link
            href='/forgot-password'
            className='text-sm text-primary hover:underline'
          >
            Forgot your password?
          </Link>
          <div className='text-sm text-light-secondary dark:text-dark-secondary'>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='text-primary hover:underline'>
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
