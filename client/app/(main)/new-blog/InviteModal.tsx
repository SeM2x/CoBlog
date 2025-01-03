import { useState, useEffect } from 'react';
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
import { Search } from 'lucide-react';
import { getUsers } from '@/lib/actions/users';
import { PartialUser } from '@/types';

interface InviteCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (collaborators: PartialUser[]) => void;
  existingCollaborators: PartialUser[];
}

const mockUsers: PartialUser[] = [
  {
    id: '1',
    username: 'Alice Johnson',
    profileUrl: '/profileUrls/alice-johnson.jpg',
  },
  { id: '2', username: 'Bob Smith', profileUrl: '/profileUrls/bob-smith.jpg' },
  {
    id: '3',
    username: 'Charlie Brown',
    profileUrl: '/profileUrls/charlie-brown.jpg',
  },
  {
    id: '4',
    username: 'Diana Prince',
    profileUrl: '/profileUrls/diana-prince.jpg',
  },
  {
    id: '5',
    username: 'Ethan Hunt',
    profileUrl: '/profileUrls/ethan-hunt.jpg',
  },
  {
    id: '6',
    username: 'Fiona Gallagher',
    profileUrl: '/profileUrls/fiona-gallagher.jpg',
  },
  {
    id: '7',
    username: 'George Lucas',
    profileUrl: '/profileUrls/george-lucas.jpg',
  },
  {
    id: '8',
    username: 'Hannah Montana',
    profileUrl: '/profileUrls/hannah-montana.jpg',
  },
];

export default function InviteModal({
  isOpen,
  onClose,
  onInvite,
  existingCollaborators,
}: InviteCollaboratorsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<PartialUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<PartialUser[]>([]);

  useEffect(() => {
    setAvailableUsers(
      mockUsers.filter(
        (user) => !existingCollaborators.some((c) => c.id === user.id)
      )
    );
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
      users: selectedUsers.map((user) => user.id),
      blogId: params.id ? params.id[0] : '',
    });
    onInvite(selectedUsers);
    setSelectedUsers([]);
    setSearchQuery('');
  };

  const { execute } = useAction(getUsers, {
    onSuccess: ({ data }) => {
      if (data) setAvailableUsers((prev) => [...prev, ...data]);
    },
  });

  const handleSearch = () => {
    execute(searchQuery);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Invite Collaborators</DialogTitle>
          <DialogDescription>
            Search and select users to invite as collaborators for your blog
            post.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex gap-2'>
            <Input
              placeholder='Search users...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              size='icon'
              className='rounded-full aspect-square'
              onClick={handleSearch}
            >
              <Search />
            </Button>
          </div>
          <ScrollArea className='h-[300px] border rounded-md p-2'>
            {filteredUsers.map((user) => (
              <div key={user.id} className='flex items-center space-x-2 py-2'>
                <Checkbox
                  id={`user-${user.id}`}
                  checked={selectedUsers.some((u) => u.id === user.id)}
                  onCheckedChange={() => handleUserSelect(user)}
                />
                <Label
                  htmlFor={`user-${user.id}`}
                  className='flex items-center space-x-2 cursor-pointer'
                >
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={user.profileUrl} alt={user.username} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <span>{user.username}</span>
                </Label>
              </div>
            ))}
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button
            loading={isInvitePending}
            onClick={handleInvite}
            disabled={selectedUsers.length === 0}
          >
            Invite Selected ({selectedUsers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
