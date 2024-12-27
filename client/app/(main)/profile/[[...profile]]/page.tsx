'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserStore } from '@/lib/store';
import { useAction } from 'next-safe-action/hooks';
import { updateProfile } from '@/lib/actions/users';
import { toast } from '@/hooks/use-toast';
import { updateLocalUser } from '@/lib/utils/local-storage';

const userBlogs = [
  {
    id: 1,
    title: 'Getting Started with Next.js 14',
    excerpt: 'Learn how to build modern web applications with Next.js 14...',
  },
  {
    id: 2,
    title: 'Mastering TypeScript for React Development',
    excerpt: 'Discover how TypeScript can improve your React development...',
  },
];

const userDrafts = [
  {
    id: 1,
    title: 'The Future of Web Development',
    excerpt: 'Exploring upcoming trends and technologies in web development...',
  },
  {
    id: 2,
    title: 'Building Scalable APIs with Node.js',
    excerpt:
      'Best practices for creating robust and scalable APIs using Node.js...',
  },
];

const emptyProfile = {
  profileUrl: '',
  firstName: '',
  lastName: '',
  bio: '',
};

export default function ProfilePage() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState(emptyProfile);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const { execute, isPending } = useAction(updateProfile, {
    onSettled: ({ input, result: { data } }) => {
      if (data?.success) {
        if (user) {
          setUser({ ...user, ...input });
          updateLocalUser({ ...user, ...input });
        }
        setIsEditProfileOpen(false);
        toast({
          title: 'Profile updated successfully',
        });
      } else {
        toast({
          title: 'Failed to update profile',
          variant: 'destructive',
        });
      }
    },
  });

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProfile) execute(editedProfile);
  };

  useEffect(() => {
    if (user) {
      setEditedProfile({
        profileUrl: user.profileUrl || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  return (
    <div className='space-y-6'>
      <Card>
        <CardContent className='flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 p-6'>
          <Avatar className='h-24 w-24'>
            <AvatarImage
              src={user?.profileUrl.split('/')[4] || ''}
              alt={`${user?.firstName}-profile-picture`}
            />
            <AvatarFallback>
              {user?.firstName
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='space-y-2 text-center sm:text-left'>
            <h1 className='text-2xl font-bold'>
              {user?.firstName} {user?.lastName}
            </h1>
            <p className='text-light-secondary dark:text-dark-secondary'>
              @{user?.username}
            </p>
            <p>{user?.bio}</p>
            <div className='flex justify-center space-x-4 sm:justify-start'>
              <span>{user?.followerCount} Followers</span>
              <span>{user?.followingCount} Following</span>
            </div>
          </div>
          <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
            <DialogTrigger asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleEditProfile}>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='name' className='text-right'>
                      First name
                    </Label>
                    <Input
                      id='firstName'
                      value={editedProfile?.firstName}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          firstName: e.target.value,
                        })
                      }
                      className='col-span-3'
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='username' className='text-right'>
                      Last name{' '}
                    </Label>
                    <Input
                      id='lastName'
                      value={editedProfile?.lastName}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          lastName: e.target.value,
                        })
                      }
                      className='col-span-3'
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='bio' className='text-right'>
                      Bio
                    </Label>
                    <Textarea
                      id='bio'
                      value={editedProfile?.bio}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          bio: e.target.value,
                        })
                      }
                      className='col-span-3'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button loading={isPending} type='submit'>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Tabs defaultValue='blogs'>
        <TabsList>
          <TabsTrigger value='blogs'>Blogs</TabsTrigger>
          <TabsTrigger value='drafts'>Drafts</TabsTrigger>
          <TabsTrigger value='about'>About</TabsTrigger>
        </TabsList>
        <TabsContent value='blogs'>
          <div className='grid gap-4'>
            {userBlogs.map((blog) => (
              <Card key={blog.id}>
                <CardHeader>
                  <CardTitle>{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{blog.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value='drafts'>
          <div className='grid gap-4'>
            {userDrafts.map((draft) => (
              <Card key={draft.id}>
                <CardHeader>
                  <CardTitle>{draft.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{draft.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value='about'>
          <Card>
            <CardHeader>
              <CardTitle>About {user?.firstName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{user?.bio}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
