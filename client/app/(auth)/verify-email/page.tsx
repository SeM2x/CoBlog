'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmailValidationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending'
  );

  useEffect(() => {
    async function validateEmail() {
      if (!token) {
        setStatus('error');
        return;
      }
      try {
        // Call your backend endpoint with the token
        // e.g., await validateEmailToken(token);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }
    validateEmail();
  }, [token]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Email Validation
          </CardTitle>
          <CardDescription className='text-center'>
            {status === 'pending'
              ? 'Validating your email...'
              : status === 'success'
              ? 'Your email has been successfully validated!'
              : 'Validation failed. Please try again or contact support.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Optionally, add more info or instructions here */}
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button
            onClick={() => router.push('/dashboard')}
            disabled={status !== 'success'}
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
