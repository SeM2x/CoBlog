import { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAction } from 'next-safe-action/hooks';
import { inviteCollaborator } from '@/lib/actions/blogs';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { LoaderCircle, Search, UserPlus, X } from 'lucide-react';
import { getUsers } from '@/lib/actions/users';
import { PartialUser } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface InviteCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (collaborators: PartialUser[]) => void;
  existingCollaborators: PartialUser[];
  invitedUsers: PartialUser[];
}

export default function InviteModal({
  isOpen,
  onClose,
  onInvite,
  existingCollaborators,
  invitedUsers,
}: InviteCollaboratorsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<PartialUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<PartialUser[]>([]);

  useEffect(() => {
    setAvailableUsers(
      availableUsers.filter(
        (user) => !existingCollaborators.some((c) => c.id === user.id)
      )
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingCollaborators]);

  const filteredUsers = availableUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (user: PartialUser) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const { executeAsync: executeInvite, isPending: isInvitePending } = useAction(
    inviteCollaborator,
    {
      onSuccess: ({ data }) => {
        toast({ title: data });
        onInvite(selectedUsers);
      },
      onError: ({ error }) => {
        console.log(error);
        toast({ title: 'Error inviting collaborator', variant: 'destructive' });
      },
    }
  );

  const params = useParams();

  const handleInvite = async () => {
    console.log(selectedUsers);

    await executeInvite({
      users: selectedUsers.map((user) => ({ id: user.id })),
      blogId: params.id ? params.id[0] : '',
    });
    setSelectedUsers([]);
    setSearchQuery('');
  };

  const { execute: executeSearch, isPending: isSearchPending } = useAction(
    getUsers,
    {
      onSuccess: ({ data }) => {
        if (data) setAvailableUsers(data);
      },
    }
  );

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Invite Collaborators</DialogTitle>
          <DialogDescription>
            Invite users to collaborate on your blog post.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue='search' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='search'>Search Users</TabsTrigger>
            <TabsTrigger value='invited'>
              Invited ({invitedUsers.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value='search'>
            <Card>
              <CardContent className='p-4'>
                <form action='' onSubmit={handleSearch}>
                  <div className='relative'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Search users...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='pl-8'
                    />
                  </div>
                </form>
                <ScrollArea className='h-[300px] mt-4'>
                  {isSearchPending ? (
                    <LoaderCircle className='animate-spin h-8 w-8 mx-auto' />
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className='flex items-center space-x-4 py-2'
                      >
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedUsers.some((u) => u.id === user.id)}
                          onCheckedChange={() => handleUserSelect(user)}
                        />
                        <Label
                          htmlFor={`user-${user.id}`}
                          className='flex items-center space-x-4 cursor-pointer flex-1'
                        >
                          <Avatar>
                            <AvatarImage
                              src={user.profileUrl}
                              alt={user.username}
                            />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          <span className='flex-1'>{user.username}</span>
                        </Label>
                      </div>
                    ))
                  )}
                  {availableUsers.length === 0 && (
                    <div className='text-center text-muted-foreground py-4'>
                      No users found
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='invited'>
            <Card>
              <CardContent className='p-4'>
                <ScrollArea className='h-[300px]'>
                  {invitedUsers.map((user) => (
                    <div
                      key={user.id}
                      className='flex items-center justify-between py-2'
                    >
                      <div className='flex items-center space-x-4'>
                        <Avatar>
                          <AvatarImage
                            src={user.profileUrl}
                            alt={user.username}
                          />
                          <AvatarFallback>{user.username[0]}</AvatarFallback>
                        </Avatar>
                        <span>{user.username}</span>
                      </div>
                      <Button variant='ghost' size='sm' onClick={() => {}}>
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                  {invitedUsers.length === 0 && (
                    <div className='text-center text-muted-foreground py-4'>
                      No users invited yet
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            onClick={handleInvite}
            loading={isInvitePending}
            disabled={selectedUsers.length === 0}
          >
            <UserPlus className='mr-2 h-4 w-4' />
            Invite Selected ({selectedUsers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
