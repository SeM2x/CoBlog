'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Github,
  Linkedin,
  Mail,
  Twitter,
  UserPlus,
  UserMinus,
  MoreVertical,
  Flag,
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { followUser, unfollowUser } from '@/lib/actions/users';
import { toast } from '@/hooks/use-toast';

// Mock data for a user profile
const userProfile = {
  id: '2',
  name: 'Jane Smith',
  username: 'janesmith',
  avatar: '/placeholder.svg?height=128&width=128',
  bio: 'Frontend developer | UI/UX enthusiast | Tech blogger',
  location: 'New York, NY',
  website: 'https://janesmith.com',
  joinDate: '2020-03-10',
  following: 180,
  followers: 750,
  totalPosts: 32,
  totalLikes: 980,
  email: 'jane@example.com',
  github: 'janesmith',
  twitter: 'janesmith',
  linkedin: 'janesmith',
};

const popularPosts = [
  { id: 1, title: 'Mastering CSS Grid Layout', likes: 180, comments: 38 },
  { id: 2, title: 'The Future of JavaScript', likes: 145, comments: 27 },
  {
    id: 3,
    title: 'Responsive Design Best Practices',
    likes: 132,
    comments: 23,
  },
];

const coposts = [
  {
    id: 1,
    title: 'Collaborative Post on React Hooks',
    collaborators: ['Alice', 'Bob'],
  },
  {
    id: 2,
    title: 'Team Project: Building a RESTful API',
    collaborators: ['Charlie', 'David'],
  },
  {
    id: 3,
    title: 'Joint Venture: Machine Learning Basics',
    collaborators: ['Eve', 'Frank'],
  },
];

const availableBlogs = [
  {
    id: 1,
    title: 'Advanced React Patterns',
    collaborators: [
      { name: 'John Doe', avatar: '/placeholder.svg?height=32&width=32' },
      { name: 'Alice Smith', avatar: '/placeholder.svg?height=32&width=32' },
    ],
  },
  {
    id: 2,
    title: 'GraphQL Best Practices',
    collaborators: [
      { name: 'Bob Johnson', avatar: '/placeholder.svg?height=32&width=32' },
    ],
  },
  {
    id: 3,
    title: 'Serverless Architecture',
    collaborators: [
      { name: 'Emma Wilson', avatar: '/placeholder.svg?height=32&width=32' },
      { name: 'David Brown', avatar: '/placeholder.svg?height=32&width=32' },
    ],
  },
];

export default function UserProfile({ user }: { user?: Profile }) {
  const [isFollowing, setIsFollowing] = useState(
    user?.relationship === 'following'
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const params = useParams();
  const handleFollowToggle = async () => {
    if (!user) return;
    setIsFollowing(!isFollowing);

    const res = isFollowing
      ? await unfollowUser(user.id)
      : await followUser(user.id);
    if (!res.success) {
      toast({
        title: `Failed to ${isFollowing ? 'unfollow' : 'follow'} user`,
        variant: 'destructive',
      });
    }
  };

  const handleInvite = (blogId: number) => {
    console.log(`Inviting user ${params.id} to collaborate on blog ${blogId}`);
    setIsInviteModalOpen(false);
  };

  const router = useRouter();

  useEffect(() => {
    if (user?.relationship === 'me') {
      router.push(`/profile`);
    }
  }, [router, user]);

  if (!user || user.relationship === 'me') {
    return null;
  }
  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='mb-8 relative'>
        <CardContent className='pt-6'>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={user.profileUrl} alt={user?.username} />
              <AvatarFallback>
                {user.username
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 text-center md:text-left'>
              <div className='flex gap-2 w-full items-center justify-center md:justify-start'>
                <h1 className='text-3xl font-bold mb-2'>
                  {user.firstName} {user.lastName}
                </h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className='absolute md:static top-3 right-3'
                      variant='ghost'
                      size='icon'
                    >
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onSelect={() => console.log('Report user')}
                    >
                      <Flag className='mr-2 h-4 w-4' />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className='text-xl text-muted-foreground mb-4'>
                @{user.username}
              </p>
              <p className='text-lg mb-4'>{user.bio}</p>
              <div className='flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  Joined{' '}
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              <Button
                variant={isFollowing ? 'secondary' : 'default'}
                onClick={handleFollowToggle}
              >
                {isFollowing ? (
                  <UserMinus className='mr-2 h-4 w-4' />
                ) : (
                  <UserPlus className='mr-2 h-4 w-4' />
                )}
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
              <Button
                variant='outline'
                onClick={() => setIsInviteModalOpen(true)}
              >
                <UserPlus className='mr-2 h-4 w-4' /> Invite to Collaborate
              </Button>
              <div className='flex gap-4'>
                <a
                  href={`mailto:${user.email}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button variant='outline' size='icon'>
                    <Mail className='h-4 w-4' />
                  </Button>
                </a>
                <a
                  href={`https://github.com/${userProfile.github}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button variant='outline' size='icon'>
                    <Github className='h-4 w-4' />
                  </Button>
                </a>
                <a
                  href={`https://twitter.com/${userProfile.twitter}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button variant='outline' size='icon'>
                    <Twitter className='h-4 w-4' />
                  </Button>
                </a>
                <a
                  href={`https://linkedin.com/in/${userProfile.linkedin}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button variant='outline' size='icon'>
                    <Linkedin className='h-4 w-4' />
                  </Button>
                </a>
              </div>
            </div>
          </div>
          <div className='flex justify-center md:justify-start gap-8 mt-8'>
            <div className='text-center'>
              <p className='text-2xl font-bold'>{user.followingCount}</p>
              <p className='text-sm text-muted-foreground'>Following</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold'>{user.followerCount}</p>
              <p className='text-sm text-muted-foreground'>Followers</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold'>{userProfile.totalPosts}</p>
              <p className='text-sm text-muted-foreground'>Posts</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold'>{userProfile.totalLikes}</p>
              <p className='text-sm text-muted-foreground'>Likes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue='posts' className='w-full'>
        <TabsList>
          <TabsTrigger value='posts'>Posts</TabsTrigger>
          <TabsTrigger value='coposts'>Coposts</TabsTrigger>
        </TabsList>
        <TabsContent value='posts'>
          <Card>
            <CardHeader>
              <CardTitle>Popular Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {popularPosts.map((post) => (
                <div key={post.id} className='mb-4 last:mb-0'>
                  <Link
                    href={`/blog/${post.id}`}
                    className='text-lg font-medium hover:underline'
                  >
                    {post.title}
                  </Link>
                  <div className='flex gap-4 mt-2 text-sm text-muted-foreground'>
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                  <Separator className='mt-4' />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='coposts'>
          <Card>
            <CardHeader>
              <CardTitle>Coposts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-[400px]'>
                {coposts.map((copost) => (
                  <div key={copost.id} className='mb-4 last:mb-0'>
                    <Link
                      href={`/blog/${copost.id}`}
                      className='text-lg font-medium hover:underline'
                    >
                      {copost.title}
                    </Link>
                    <div className='flex gap-4 mt-2 text-sm text-muted-foreground'>
                      <span>
                        Collaborated with {copost.collaborators.join(', ')}
                      </span>
                    </div>
                    <Separator className='mt-4' />
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              Invite {user.firstName} {user.lastName} to Collaborate
            </DialogTitle>
            <DialogDescription>
              Choose a blog to invite {user.firstName} {user.lastName} to
              collaborate on.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Input placeholder='Search blogs...' className='mb-4' />
            <ScrollArea className='h-[300px]'>
              {availableBlogs.map((blog) => (
                <Card key={blog.id} className='mb-4'>
                  <CardHeader className='p-4'>
                    <CardTitle className='text-lg'>{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent className='p-4 pt-0'>
                    <div className='flex items-center justify-between'>
                      <div className='flex -space-x-2'>
                        {blog.collaborators.map((collaborator, index) => (
                          <Avatar
                            key={index}
                            className='border-2 border-background'
                          >
                            <AvatarImage src={collaborator.avatar} />
                            <AvatarFallback>
                              {collaborator.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <Button onClick={() => handleInvite(blog.id)}>
                        Invite
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
