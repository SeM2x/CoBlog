'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { CoAuthor } from '@/types';
interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: CoAuthor[];
  handleRoleChange: (
    collaboratorId: string,
    newRole: 'owner' | 'editor' | 'viewer'
  ) => void;
  handleRemoveCollaborator: (collaboratorId: string) => void;
}

export default function PermissionsModal({
  isOpen,
  onClose,
  collaborators,
  handleRoleChange,
  handleRemoveCollaborator,
}: ManagePermissionsModalProps) {
  const handleSave = () => {
    // Here you would typically send the updated collaborators to your backend
    console.log('Updated collaborators:', collaborators);
    onClose();
  };

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className='flex items-center space-x-4'>
              <Avatar className='h-8 w-8'>
                <AvatarImage
                  src={collaborator.profileUrl || ''}
                  alt={collaborator.username}
                />
                <AvatarFallback>{collaborator.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className='flex-grow'>{collaborator.username}</span>
              <Select
                value={collaborator.role || 'viewer'}
                onValueChange={(value: 'owner' | 'editor' | 'viewer') =>
                  handleRoleChange(collaborator.id, value)
                }
              >
                <SelectTrigger className='w-[100px]'>
                  <SelectValue placeholder='Select role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='owner'>Owner</SelectItem>
                  <SelectItem value='editor'>Editor</SelectItem>
                  <SelectItem value='viewer'>Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleRemoveCollaborator(collaborator.id)}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
        <div className='flex justify-end space-x-2'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
