'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { MessageCircle, User, UserMinus } from 'lucide-react';
import {
  followUser,
  getUserFollowings,
  getUsers,
  unfollowUser,
} from '@/lib/actions/users';
import { PartialUser } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [keyword] = useState(searchParams.get('keyword') || '');
  const [followings, setFollowings] = useState<string[]>([]);
  const [users, setUsers] = useState<PartialUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('authors');

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const searchUsers = async (searchKeyword: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const userFollowings = user
          ? await getUserFollowings(user.id)
          : undefined;
        if (userFollowings)
          setFollowings(userFollowings.map((user) => user.id));
        const data = (await getUsers(encodeURIComponent(searchKeyword)))?.data;
        if (data) setUsers(data);
      } catch (err) {
        setError('An error occurred while fetching users. Please try again.');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (keyword) {
      searchUsers(keyword);
    }
  }, [keyword, user]);

  const handleFollowUser = async (userId: string) => {
    const res = await followUser(userId);
    if (res.success) {
      setFollowings((prev) => [...prev, userId]);
    } else {
      toast({ title: 'Failed to follow user', variant: 'destructive' });
    }
  };

  const handleUnfollowUser = async (userId: string) => {
    const res = await unfollowUser(userId);
    if (res.success) {
      setFollowings((prev) => prev.filter((id) => id !== userId));
    } else {
      toast({ title: 'Failed to unfollow user', variant: 'destructive' });
    }
  };

  return (
    <div className='container mx-auto space-y-6 px-4 py-6'>
      <h2 className='text-2xl font-bold tracking-tight'>
        Search results for &quot;{keyword}&quot;
      </h2>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='authors'>Authors</TabsTrigger>
          <TabsTrigger value='blogs'>Blogs</TabsTrigger>
        </TabsList>
        <TabsContent value='authors'>
          <Card>
            <CardContent>
              {isLoading ? (
                <div className='flex flex-col items-center py-8'>
                  <p>Loading...</p>
                </div>
              ) : error ? (
                <div className='flex flex-col items-center py-8 text-destructive'>
                  <p>{error}</p>
                </div>
              ) : users.length > 0 ? (
                <ScrollArea className='h-[400px]'>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className='flex items-center justify-between space-x-4 py-4 border-b last:border-none'
                    >
                      <div className='flex items-center space-x-4'>
                        <Avatar>
                          <AvatarImage
                            src={user.profileUrl}
                            alt={user.username}
                          />
                          <AvatarFallback>
                            {user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/profile/${user.id}`}
                            className='text-sm font-medium leading-none hover:underline'
                          >
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.username}
                          </Link>
                          <p className='text-sm text-muted-foreground'>
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      {followings.includes(user.id) ? (
                        <Button
                          className='min-w-32'
                          onClick={() => handleUnfollowUser(user.id)}
                          variant='outline'
                          size='sm'
                        >
                          <UserMinus className='mr-2 h-4 w-4' />
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          className='min-w-32'
                          onClick={() => handleFollowUser(user.id)}
                          variant='outline'
                          size='sm'
                        >
                          <User className='mr-2 h-4 w-4' />
                          Follow
                        </Button>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <div className='flex flex-col items-center py-8'>
                  <User className='h-10 w-10 text-muted-foreground' />
                  <h3 className='mt-2 text-sm font-semibold'>No users found</h3>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Try adjusting your search to find what you&apos;re looking
                    for.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='blogs'>
          <Card>
            <CardContent>
              <div className='flex flex-col items-center py-8'>
                <MessageCircle className='h-10 w-10 text-muted-foreground' />
                <h3 className='mt-2 text-sm font-semibold'>
                  No blog posts found
                </h3>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Try adjusting your search or filter to find what you&apos;re
                  looking for.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
