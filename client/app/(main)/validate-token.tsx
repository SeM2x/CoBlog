'use client';

import { validateToken } from '@/lib/actions/auth';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

const ValidateToken = () => {
  useEffect(() => {
    const validate = async () => {
      const res = await validateToken();
      if (!res?.success && res?.status === 403) {
        signOut({ redirectTo: '/login?error=sessionExpired' });
      }
    };
    validate();
  }, []);
  return null;
};

export default ValidateToken;
