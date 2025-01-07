import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Notification } from '@/types';
import React from 'react';

type InvitationModalProps = {
  selectedInvitation: Notification | null;
  setSelectedInvitation: (invitation: Notification | null) => void;
  handleInvitationResponse: (
    accept: boolean,
    { notificationId, blogId }: { notificationId?: string; blogId?: string }
  ) => void;
  loading: { accept: boolean; reject: boolean };
};

const InvitationModal = ({
  selectedInvitation,
  setSelectedInvitation,
  handleInvitationResponse,
  loading,
}: InvitationModalProps) => {
  return (
    <Dialog
      open={!!selectedInvitation}
      onOpenChange={() => setSelectedInvitation(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Blog Collaboration Invitation</DialogTitle>
          <DialogDescription>
            {selectedInvitation?.author?.username} has invited you to
            collaborate on the blog post &quot;
            {selectedInvitation?.blogId?.title}&quot; as an{' '}
            {selectedInvitation?.role}
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-4 my-4'>
          <Avatar>
            <AvatarImage
              src={selectedInvitation?.author?.profileUrl}
              alt={selectedInvitation?.author?.username}
            />
            <AvatarFallback>
              {selectedInvitation?.author?.username
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='font-semibold'>
              {selectedInvitation?.author?.username}
            </p>
            <p className='text-sm text-muted-foreground'>
              Inviting you to collaborate
            </p>
          </div>
        </div>
        <DialogFooter>
          {selectedInvitation?.status === 'pending' ? (
            <>
              <Button
                loading={loading.reject}
                variant='outline'
                onClick={() =>
                  handleInvitationResponse(false, {
                    notificationId: selectedInvitation._id,
                    blogId: selectedInvitation.blogId?.id,
                  })
                }
              >
                Reject
              </Button>
              <Button
                loading={loading.accept}
                onClick={() =>
                  handleInvitationResponse(true, {
                    notificationId: selectedInvitation._id,
                    blogId: selectedInvitation.blogId?.id,
                  })
                }
              >
                Accept
              </Button>
            </>
          ) : (
            <Badge variant='outline' className='text-muted-foreground'>
              This invitation has been {selectedInvitation?.status}
            </Badge>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationModal;
