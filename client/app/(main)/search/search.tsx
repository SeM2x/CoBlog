'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { MessageCircle, User } from 'lucide-react';
import { getUsers } from '@/lib/actions/users';
import { PartialUser } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [keyword] = useState(searchParams.get('keyword') || '');
  const [users, setUsers] = useState<PartialUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('authors');

  useEffect(() => {
    if (keyword) {
      searchUsers(keyword);
    }
  }, []);

  const searchUsers = async (searchKeyword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace this with your actual API endpoint
      const data = (await getUsers(encodeURIComponent(searchKeyword)))?.data;
      if (data) setUsers(data);
    } catch (err) {
      setError('An error occurred while fetching users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4'>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='authors'>Authors</TabsTrigger>
          <TabsTrigger value='blogs'>Blogs</TabsTrigger>
        </TabsList>
        <TabsContent value='authors'>
          <Card>
            <CardContent>
              {isLoading ? (
                <div className='text-center py-8'>
                  <p>Loading...</p>
                </div>
              ) : error ? (
                <div className='text-center py-8 text-red-500'>
                  <p>{error}</p>
                </div>
              ) : users.length > 0 ? (
                <ScrollArea className='h-[400px]'>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className='flex items-center space-x-4 mb-4 last:mb-0'
                    >
                      <Avatar>
                        <AvatarImage
                          src={user.profileUrl}
                          alt={user.username}
                        />
                        <AvatarFallback>
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 space-y-1'>
                        <Link
                          href={`/profile/${user.id}`}
                          className='font-medium hover:underline'
                        >
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username}
                        </Link>
                        <p className='text-sm text-muted-foreground'>
                          @{user.username}
                        </p>
                      </div>
                      <Button variant='outline'>
                        <User className='mr-2 h-4 w-4' />
                        Follow
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <div className='text-center py-8'>
                  <User className='mx-auto h-12 w-12 text-muted-foreground' />
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
              {false ? (
                <ScrollArea className='h-[400px]'></ScrollArea>
              ) : (
                <div className='text-center py-8'>
                  <MessageCircle className='mx-auto h-12 w-12 text-muted-foreground' />
                  <h3 className='mt-2 text-sm font-semibold'>
                    No blog posts found
                  </h3>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Try adjusting your search or filter to find what you&apos;re
                    looking for.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
