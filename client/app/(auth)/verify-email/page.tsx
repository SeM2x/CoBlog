'use client';

import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import VerificationCard from '@/components/common/VerificationCard';

export default function EmailValidationPage() {
  const router = useRouter();

  const onSuccess = () => {
    toast({
      description: 'Email verified successfully!',
    });
    router.push('/login');
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg px-4'>
      <VerificationCard onSuccess={onSuccess} />
    </div>
  );
}
