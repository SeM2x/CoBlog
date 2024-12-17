'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Mock function to fetch user data
const fetchUserProfile = async (id: string) => {
  // In a real app, this would be an API call
  return {
    id,
    name: 'John Doe',
    bio: 'Passionate blogger and tech enthusiast',
    avatar: '/placeholder-avatar.jpg',
    followers: 1000,
    following: 500,
    blogs: [
      { id: 1, title: 'My First Blog Post' },
      { id: 2, title: 'Exploring New Technologies' },
    ],
  };
};

type Profile = {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  blogs: { id: number; title: string }[];
};

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<Profile>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile>();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile(params.id as string);
        setProfile(data);
        setEditedProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive',
        });
      }
    };

    loadProfile();
  }, [params.id, toast]);

  const handleSave = async () => {
    // In a real app, this would be an API call to update the profile
    setProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: 'Success',
      description: 'Profile updated successfully',
    });
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-8'>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl font-bold'>User Profile</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Avatar className='w-20 h-20'>
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className='text-2xl font-semibold'>{profile.name}</h2>
              <p className='text-muted-foreground'>{profile.bio}</p>
            </div>
          </div>
          <div className='flex space-x-4'>
            <div>
              <strong>{profile.followers}</strong> Followers
            </div>
            <div>
              <strong>{profile.following}</strong> Following
            </div>
          </div>
          {isEditing ? (
            <div className='space-y-4'>
              <div>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  value={editedProfile?.name}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      name: e.target.value,
                    } as Profile)
                  }
                />
              </div>
              <div>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  value={editedProfile?.bio}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      bio: e.target.value,
                    } as Profile)
                  }
                />
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant='outline' onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Published Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='space-y-2'>
            {profile.blogs.map((blog) => (
              <li key={blog.id}>{blog.title}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
