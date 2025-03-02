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
import { ForgotPasswordSchema } from '@/lib/form-validation/auth';
import { useAction } from 'next-safe-action/hooks';
import { sendResetEmail } from '@/lib/actions/auth';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<{
    content: string;
    error: boolean;
  } | null>(null);
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { execute, isPending } = useAction(sendResetEmail, {
    onSuccess: () => {
      setMessage({
        error: false,
        content:
          'If an account exists for that email, you will receive reset instructions shortly.',
      });
    },
    onError: ({ error: { serverError } }) => {
      if (serverError) setMessage({ error: true, content: serverError });
    },
  });

  async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    execute(values);
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 relative'>
          <Link href='/login' className='absolute left-54 top-6.5'>
            <Button size='icon' variant='ghost'>
              <ArrowLeft />
            </Button>
          </Link>
          <CardTitle className='text-2xl font-bold text-center'>
            Forgot Password
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your email to receive reset instructions.
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
              {message && (
                <div
                  className={`text-sm ${
                    message.error ? 'text-red-600' : 'text-green-600'
                  } text-start`}
                >
                  {message.content}
                </div>
              )}
              <Button loading={isPending} type='submit' className='w-full'>
                Send Reset Email
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
