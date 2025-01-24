'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { Camera, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import getImageId from '@/lib/utils/get-image-id';

const userBlogs = [
  {
    id: 1,
    title: 'Getting Started with Next.js 14',
    excerpt: 'Learn how to build modern web applications with Next.js 14...',
    publishDate: '2023-06-15',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Mastering TypeScript for React Development',
    excerpt: 'Discover how TypeScript can improve your React development...',
    publishDate: '2023-06-10',
    readTime: '7 min read',
  },
];

const userDrafts = [
  {
    id: 1,
    title: 'The Future of Web Development',
    excerpt: 'Exploring upcoming trends and technologies in web development...',
    lastEdited: '2023-06-20',
  },
  {
    id: 2,
    title: 'Building Scalable APIs with Node.js',
    excerpt:
      'Best practices for creating robust and scalable APIs using Node.js...',
    lastEdited: '2023-06-18',
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
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const { execute, isPending } = useAction(updateProfile, {
    onSettled: ({ input, result: { data } }) => {
      if (data?.success) {
        const { preference, ...info } = input;
        console.log(preference);

        updateUser({ ...info, profileUrl: data.profileUrl });
        updateLocalUser({ ...info, profileUrl: data.profileUrl });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProfile) {
      const formData = new FormData();
      if (file) {
        formData.set('avatar', file);
      }
      execute({ ...editedProfile, profilePicture: formData });
    }
  };

  useEffect(() => {
    if (user) {
      setEditedProfile({
        profileUrl: user.profileUrl || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
      });
      setProfilePicPreview(null);
    }
  }, [user]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='mb-8'>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
            <div className='relative'>
              <Avatar className='h-32 w-32'>
                <AvatarImage
                  src={getImageId(user?.profileUrl)}
                  alt={`${user?.firstName}-profile-picture`}
                />
                <AvatarFallback className='text-4xl'>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <Dialog
                open={isEditProfileOpen}
                onOpenChange={setIsEditProfileOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size='icon'
                    variant='outline'
                    className='absolute bottom-0 right-0'
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <form onSubmit={handleEditProfile}>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='flex items-center gap-4'>
                        <Avatar className='h-24 w-24'>
                          {profilePicPreview ? (
                            <Image
                              src={profilePicPreview}
                              width={96}
                              height={96}
                              alt='Profile picture'
                              className='object-contain rounded-full'
                            />
                          ) : (
                            <AvatarImage
                              src={
                                profilePicPreview ||
                                getImageId(user?.profileUrl)
                              }
                              alt='Profile picture'
                            />
                          )}

                          <AvatarFallback className='text-2xl'>
                            {editedProfile.firstName?.[0]}
                            {editedProfile.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Label htmlFor='picture' className='cursor-pointer'>
                          <div className='flex items-center gap-2 text-sm text-muted-foreground hover:text-primary'>
                            <Camera className='h-4 w-4' />
                            Change Picture
                          </div>
                          <Input
                            id='picture'
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={handleFileChange}
                          />
                        </Label>
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='grid gap-2'>
                          <Label htmlFor='firstName'>First name</Label>
                          <Input
                            id='firstName'
                            value={editedProfile.firstName}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className='grid gap-2'>
                          <Label htmlFor='lastName'>Last name</Label>
                          <Input
                            id='lastName'
                            value={editedProfile.lastName}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='bio'>Bio</Label>
                        <Textarea
                          id='bio'
                          value={editedProfile.bio || ''}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              bio: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type='submit' loading={isPending}>
                        {isPending ? 'Saving' : 'Save changes'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className='flex-1 text-center md:text-left'>
              <h1 className='text-3xl font-bold mb-2'>
                {user?.firstName} {user?.lastName}
              </h1>
              <p className='text-xl text-muted-foreground mb-4'>
                @{user?.username}
              </p>
              <p className='text-lg mb-4'>{user?.bio}</p>
              {/* <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                {user?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                )}
                {user?.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {user.website}
                    </a>
                  </div>
                )}
                {user?.joinDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {format(new Date(user.joinDate), 'MMMM yyyy')}
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue='blogs' className='w-full'>
        <TabsList className='w-full justify-start'>
          <TabsTrigger value='blogs'>Blogs</TabsTrigger>
          <TabsTrigger value='drafts'>Drafts</TabsTrigger>
          <TabsTrigger value='about'>About</TabsTrigger>
        </TabsList>
        <TabsContent value='blogs' className='mt-6'>
          <div className='grid gap-6'>
            {userBlogs.map((blog) => (
              <Card key={blog.id}>
                <CardContent className='p-6'>
                  <h3 className='text-xl font-semibold mb-2'>{blog.title}</h3>
                  <p className='text-muted-foreground mb-4'>{blog.excerpt}</p>
                  <div className='flex justify-between text-sm text-muted-foreground'>
                    <span>{blog.publishDate}</span>
                    <span>{blog.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value='drafts' className='mt-6'>
          <div className='grid gap-6'>
            {userDrafts.map((draft) => (
              <Card key={draft.id}>
                <CardContent className='p-6'>
                  <h3 className='text-xl font-semibold mb-2'>{draft.title}</h3>
                  <p className='text-muted-foreground mb-4'>{draft.excerpt}</p>
                  <div className='text-sm text-muted-foreground'>
                    <span>Last edited: {draft.lastEdited}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value='about' className='mt-6'>
          <Card>
            <CardContent className='p-6'>
              <h2 className='text-2xl font-semibold mb-4'>
                About {user?.firstName}
              </h2>
              <p className='text-lg mb-4'>{user?.bio}</p>
              <div className='grid gap-2 text-muted-foreground'>
                <p>
                  <strong>Location:</strong> {'Not specified'}
                </p>
                <p>
                  <strong>Website:</strong> {'Not specified'}
                </p>
                <p>
                  <strong>Member since:</strong>{' '}
                  {user?.createdAt
                    ? format(new Date(user.createdAt), 'MMMM d, yyyy')
                    : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
