'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CodeInput } from '@/components/CodeInput'; // import the new component
import { useAction } from 'next-safe-action/hooks';
import { toast } from '@/hooks/use-toast';
import ResendButton from './ResendButton';
import { useRouter } from 'next/navigation';
import { verifyOtp } from '@/lib/actions/auth';

const VerificationCard = ({
  onSuccess,
  title,
  description,
  type = 'verify',
}: {
  onSuccess: () => void;
  title?: string;
  description?: string;
  type?: 'verify' | 'reset';
}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();

  const router = useRouter();

  const { execute, isPending } = useAction(verifyOtp, {
    onSuccess,
    onError: ({ error: { validationErrors, serverError } }) => {
      toast({
        variant: 'destructive',
        description:
          serverError ||
          (validationErrors?.email?._errors &&
            validationErrors.email._errors[0]),
      });
      setError(serverError);
    },
  });

  async function onSubmit() {
    if (code.length !== 6) return;
    execute({
      token: code,
      email: email || '',
      type: type === 'verify' ? 'verify_account' : 'validate_token',
    });
  }

  useEffect(() => {
    setEmail(sessionStorage.getItem('email'));
  }, []);
  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-1'>
        <div className='flex items-center justify-between space-x-2'>
          <Button variant='ghost' size='icon' onClick={() => router.back()}>
            <ArrowLeft className='w-4 h-4' />
          </Button>
          <CardTitle className='text-2xl font-bold'>
            {title || 'Email Validation'}
          </CardTitle>
          <div />
        </div>
        <CardDescription className='text-center text-sm text-light-secondary dark:text-dark-secondary'>
          {description || 'Enter the 6-digit code sent to your email'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <CodeInput
            length={6}
            onChange={(val) => {
              setCode(val);
              setError('');
            }}
          />
          <div className='text-center text-sm text-light-secondary dark:text-dark-secondary'>
            {code.length < 6 && 'Please enter the complete 6-digit code.'}
            {error && <p className='text-destructive'>{error}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex flex-col justify-center gap-2'>
        <Button
          onClick={onSubmit}
          disabled={code.length !== 6 || isPending}
          loading={isPending}
          className='w-full max-w-xs'
        >
          Verify
        </Button>
        <div className='flex space-x-1 text-sm '>
          <p>Didn’t get a code?</p>
          <ResendButton email={email || ''} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default VerificationCard;
