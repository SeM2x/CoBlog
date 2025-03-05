'use client';

import React from 'react';

interface CountdownTimerProps {
  seconds: number;
  isActive: boolean;
  handleResend: () => void;
}

export default function CountdownTimer({
  seconds,
  isActive,
  handleResend,
}: CountdownTimerProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className='flex items-center space-x-2'>
      {isActive ? (
        <span className='text-primary font-medium'>{formatTime(seconds)}</span>
      ) : (
        <button className='text-primary font-medium' onClick={handleResend}>
          Resend
        </button>
      )}
    </div>
  );
}
