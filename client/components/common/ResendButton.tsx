'use client';
import React from 'react';
import CountdownTimer from '@/components/common/CountdownTimer';
import useCountdown from '@/hooks/useCountdown';
import { useAction } from 'next-safe-action/hooks';
import { toast } from '@/hooks/use-toast';
import { sendOTP } from '@/lib/actions/auth';

type ResendButtonProps = {
  email: string;
};
const ResendButton = ({ email }: ResendButtonProps) => {
  const { seconds, isActive, handleResend } = useCountdown(60);

  const { execute } = useAction(sendOTP, {
    onSuccess: ({ data }) => {
      if (data?.ok) {
        console.log(data.data.message);
        toast({ title: 'OTP sent successfully' });
        //alert(data.data.message);
      }
      if (data && !data.ok) {
        toast({ variant: 'destructive', title: 'Failed to send OTP' });
      }
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Something went wrong' });
      console.log(error);
    },
  });

  return (
    <CountdownTimer
      isActive={isActive}
      seconds={seconds}
      handleResend={() => {
        handleResend();
        execute({ email });
      }}
    />
  );
};

export default ResendButton;
