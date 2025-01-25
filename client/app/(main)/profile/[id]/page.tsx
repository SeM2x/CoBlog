import { getUserProfile } from '@/lib/actions/users';
import React, { Suspense } from 'react';
import UserProfile from './profile';

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileGetter userId={id} />
    </Suspense>
  );
};

export default ProfilePage;

const ProfileGetter = async ({ userId }: { userId: string }) => {
  const user = await getUserProfile(userId);
  return <UserProfile user={user} />;
};
