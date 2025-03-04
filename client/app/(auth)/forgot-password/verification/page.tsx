'use client';

import { useRouter } from 'next/navigation';
import VerificationCard from '@/components/common/VerificationCard';

export default function EmailValidationPage() {
  const router = useRouter();

  const onSuccess = () => {
    router.push('/forgot-password/reset');
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg px-4'>
      <VerificationCard
        onSuccess={onSuccess}
        title='OTP Verification'
        description=' If an account exists for that email, you will receive a code
            shortly.'
      />
    </div>
  );
}
