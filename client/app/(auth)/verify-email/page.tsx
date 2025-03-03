'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { validateEmail } from '@/lib/actions/auth'; // adjust your API call accordingly
import { useAction } from 'next-safe-action/hooks';
import { toast } from '@/hooks/use-toast';

export default function EmailValidationPage() {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();

  const { execute, isPending } = useAction(validateEmail, {
    onSuccess: () => {
      toast({
        description: 'Email verified successfully!',
      });
      router.push('/');
    },
    onError: ({ error: { serverError } }) => {
      toast({ variant: 'destructive', description: serverError });
      setError(serverError);
    },
  });

  async function onSubmit() {
    if (code.length !== 6) return;
    execute(code);
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg px-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1'>
          <div className='flex items-center justify-between space-x-2'>
            <Button variant='ghost' size='icon' onClick={() => router.back()}>
              <ArrowLeft className='w-4 h-4' />
            </Button>
            <CardTitle className='text-2xl font-bold'>
              Email Validation
            </CardTitle>
            <div />
          </div>
          <CardDescription className='text-center text-sm text-light-secondary dark:text-dark-secondary'>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <CodeInput length={6} onChange={(val) => setCode(val)} />
            <div className='text-center text-sm text-light-secondary dark:text-dark-secondary'>
              {code.length < 6 && 'Please enter the complete 6-digit code.'}
              {error && <p className='text-destructive'>{error}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button
            onClick={onSubmit}
            disabled={code.length !== 6 || isPending}
            loading={isPending}
          >
            Validate Code
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
