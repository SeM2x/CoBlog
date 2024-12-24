'use client';

import { Profile } from '@/types';

const setLocalUser = (user: Profile | null) => {
  if (!user) return null;
  localStorage.setItem('user', JSON.stringify(user));
};

const getLocalUser = (): Profile | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const updateLocalUser = (userData: Partial<Profile>) => {
  const currentUser = getLocalUser();
  if (currentUser) {
    setLocalUser({ ...currentUser, ...userData });
  }
};

const removeLocalUser = () => {
  localStorage.removeItem('user');
};

export { setLocalUser, getLocalUser, updateLocalUser, removeLocalUser };
